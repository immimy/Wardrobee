import { refreshCart } from '@/utils/actions';
import { isHistoryEqualToState } from '@/utils/clientFunctions';
import { CartItemState, CartItemType, CartStateType } from '@/utils/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState: CartStateType = {
  isLoading: true,
  cartOpen: false,
  removeItemOpen: false,
  removeItemId: '',
  deletedCartItems: {},
  // Cart items
  cartItems: {},
  totalQuantity: 0,
  subtotal: 0,
  // Backup
  _removedCart: {},
  _removedCartItem: {},
};

export const getFreshCart = createAsyncThunk(
  'cart/getFreshCart',
  async (_, thunkAPI) => {
    try {
      return refreshCart();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initialize cart';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartState: (
      state,
      action: PayloadAction<
        Partial<Omit<CartStateType, 'cartItems' | 'totalQuantity' | 'subtotal'>>
      >
    ) => {
      return { ...state, ...action.payload };
    },
    addCartItem: (
      state,
      action: PayloadAction<
        | CartItemType
        | { isAdded: boolean; cartItemId: string; state: CartItemState }
      >
    ) => {
      // Case: Completed adding cart item (Database response as success)
      if ('isAdded' in action.payload) {
        const { cartItemId } = action.payload;
        const { variantId, quantity } = action.payload.state;

        const cartItem = Object.values(state.cartItems).find(
          (item) => item.state.variantId === variantId
        )!;
        const history = cartItem._history;

        // 1) New cart item
        if (!history) {
          Object.assign(cartItem, {
            state: { variantId, quantity },
          });
          delete state.cartItems[variantId];
          state.cartItems = { ...state.cartItems, [cartItemId]: cartItem };
        } else {
          // 2) Existing cart item
          state.cartItems[cartItemId].state.quantity = quantity;
          cartSlice.caseReducers.clearCartItemBackup(state, {
            type: 'clearCartItemBackup',
            payload: { cartItemId, case: 'isAdding' },
          });
        }
      } else {
        // Case: In the process of adding cart item (Optimistic response)
        const { variantId, quantity } = action.payload.state;
        // Check if product is already in the cart
        const existingItem = Object.entries(state.cartItems).find(
          ([_, item]) => item.state.variantId === variantId
        );
        let isExceedStock: boolean;
        // 1) Add new item to the cart
        if (!existingItem) {
          const { data, options } = action.payload;
          // Ensure the quantity do not exceed product stock
          const { stock } = options.find((option) => option.id === variantId)!;
          isExceedStock = quantity > stock;
          const ensuredQuantity = isExceedStock ? stock : quantity;

          state.cartItems = {
            ...state.cartItems,
            [variantId]: {
              data,
              options,
              state: {
                variantId,
                quantity: ensuredQuantity,
              },
            },
          };
        } else {
          // 2) Add quantity to the existing cart item
          const [cartItemId, cartItem] = existingItem;
          // Back up cart item
          cartSlice.caseReducers.backUpCartItem(state, {
            type: 'backUpCartItem',
            payload: { cartItemId, case: 'isAdding' },
          });
          // Ensure the quantity do not exceed product stock
          const { stock } = cartItem.options.find(
            (option) => option.id === variantId
          )!;
          const newQuantity = cartItem.state.quantity + quantity;
          isExceedStock = newQuantity > stock;
          const ensuredQuantity = isExceedStock ? stock : newQuantity;

          state.cartItems[cartItemId].state.quantity = ensuredQuantity;
        }
        // Alert if reaching the stock limit
        if (isExceedStock) toast.warning('You have reached the stock limit.');
      }
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    rollbackAddCartItem: (
      state,
      action: PayloadAction<{ variantId: string }>
    ) => {
      const { variantId } = action.payload;
      const [cartItemId, cartItem] = Object.entries(state.cartItems).find(
        ([_, item]) => item.state.variantId === variantId
      )!;
      const history = cartItem._history;
      // Case I: New cart item
      if (!history) {
        delete state.cartItems[cartItemId];
      } else {
        // Case II: Existing cart item
        cartSlice.caseReducers.rollbackCartItem(state, {
          type: 'rollbackCartItem',
          payload: { cartItemId, case: 'isAdding' },
        });
      }
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    // Using when user change cart item data but not confirm yet
    setCartItem: (
      state,
      action: PayloadAction<{
        cartItemId: string;
        state: CartItemState;
      }>
    ) => {
      const { cartItemId } = action.payload;
      const { variantId, quantity } = action.payload.state;

      // Get cart item data
      const cartItem = state.cartItems[cartItemId];
      const history = cartItem._history;

      // Backup data before cart item change
      if (!history) {
        cartSlice.caseReducers.backUpCartItem(state, {
          type: 'backUpCartItem',
          payload: { cartItemId, case: 'isUpdating' },
        });
      }

      const { stock } = cartItem.options.find((item) => item.id === variantId)!;
      // Ensure that quantity not exceed the product stock
      const isExceedStock = quantity > stock;
      const ensuredQuantity = isExceedStock ? stock : quantity;
      const newState = { variantId, quantity: ensuredQuantity };
      // Set cart item state
      cartItem.state = newState;
      // Alert if reaching the stock limit
      if (isExceedStock) toast.warning('You have reached the stock limit.');

      // Clear history if new cart item state is the same as backup
      if (history && isHistoryEqualToState(history, newState)) {
        cartSlice.caseReducers.clearCartItemBackup(state, {
          type: 'clearCartItemBackup',
          payload: { cartItemId, case: 'isUpdating' },
        });
      }

      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    // Using when user change cart item data but decide to discard changes
    cancelUpdateCartItem: (
      state,
      action: PayloadAction<{ cartItemId: string }>
    ) => {
      const { cartItemId } = action.payload;
      cartSlice.caseReducers.rollbackCartItem(state, {
        type: 'clearCartItemBackup',
        payload: { cartItemId, case: 'isUpdating' },
      });
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    // Using when user confirm to change cart item data
    updateCartItem: (
      state,
      action: PayloadAction<{
        cartItemId: string;
        state: CartItemState;
        isUpdated: boolean;
      }>
    ) => {
      const { cartItemId, isUpdated } = action.payload;
      const { variantId, quantity } = action.payload.state;

      // Case: Completed an update (Database response as success)
      if (isUpdated) {
        // Determine which case that we updated the cart item
        const cartItem = state.cartItems[cartItemId];
        // (1) Update as existing product in the cart
        if (!cartItem) {
          const [existingCartItemId] = Object.entries(state.cartItems).find(
            ([_, item]) => item.state.variantId === variantId
          )!;
          // Persist success result from database
          state.cartItems[existingCartItemId].state = { variantId, quantity };
          // Clear cart item history
          cartSlice.caseReducers.clearCartItemBackup(state, {
            type: 'clearCartItemBackup',
            payload: { cartItemId: existingCartItemId, case: 'isUpdating' },
          });
          // Clear removed cart item history
          delete state._removedCartItem[cartItemId];
        } else {
          // (2) Update as new product in the cart
          // Persist success result from database
          state.cartItems[cartItemId].state = { variantId, quantity };
          // Clear cart item history
          cartSlice.caseReducers.clearCartItemBackup(state, {
            type: 'clearCartItemBackup',
            payload: { cartItemId, case: 'isUpdating' },
          });
        }
      } else {
        // Case: In the process of updating cart item (Optimistic response)
        // Check if product is already in the cart
        const cartItems = { ...state.cartItems };
        delete cartItems[cartItemId];
        const existingCartItem = Object.entries(cartItems).find(([_, item]) => {
          if (!item._history) {
            return item.state.variantId === variantId;
          } else {
            return item._history.variantId === variantId;
          }
        });
        // 1) Update as existing product in the cart
        if (existingCartItem) {
          const [existingCartItemId, existingItem] = existingCartItem;
          const { stock } = existingItem.options.find(
            (item) => item.id === variantId
          )!;
          // Back up cart item that is in the process of update
          if (!existingItem._history) {
            cartSlice.caseReducers.backUpCartItem(state, {
              type: 'backUpCartItem',
              payload: { cartItemId: existingCartItemId, case: 'isAdding' },
            });
          }
          // Ensure that quantity not exceed the product stock
          const oldQuantity = existingItem._history
            ? existingItem._history.quantity
            : existingItem.state.quantity;
          const newQuantity = (quantity || 1) + oldQuantity;
          const isExceedStock = newQuantity > stock;
          const ensuredQuantity = isExceedStock ? stock : newQuantity;
          // Update cart item state
          state.cartItems[existingCartItemId].state = {
            variantId,
            quantity: ensuredQuantity,
          };
          state.cartItems[existingCartItemId].isUpdating = false;
          // Alert if reaching the stock limit
          if (isExceedStock) toast.warning('You have reached the stock limit.');

          // Back up before remove an incoming cart item
          cartSlice.caseReducers.backUpCartItem(state, {
            type: 'backUpCartItem',
            payload: { cartItemId, case: 'isRemoving' },
          });
          // Remove incoming cart item from the cart
          delete state.cartItems[cartItemId];
        } else {
          // 2) Update as new product in the cart
          // Set up default quantity
          if (!quantity) {
            state.cartItems[cartItemId].state.quantity = 1;
          }
          // Hide submit and cancel update buttons
          state.cartItems[cartItemId].isUpdating = false;
        }
      }
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    rollbackUpdateCartItem: (
      state,
      action: PayloadAction<{ cartItemId: string; state: CartItemState }>
    ) => {
      const { cartItemId } = action.payload;
      const { variantId } = action.payload.state;

      // Determine which case that we updated the cart item
      const cartItem = state.cartItems[cartItemId];

      // (1) Update as existing product in the cart
      if (!cartItem) {
        const [existingCartItemId] = Object.entries(state.cartItems).find(
          ([_, item]) => item.state.variantId === variantId
        )!;
        // Rollback updated cart item
        cartSlice.caseReducers.rollbackCartItem(state, {
          type: 'rollbackCartItem',
          payload: { cartItemId: existingCartItemId, case: 'isUpdating' },
        });
        // Rollback removed cart item
        cartSlice.caseReducers.rollbackCartItem(state, {
          type: 'rollbackCartItem',
          payload: { cartItemId, case: 'isRemoving' },
        });
        cartSlice.caseReducers.rollbackCartItem(state, {
          type: 'rollbackCartItem',
          payload: { cartItemId, case: 'isUpdating' },
        });
      } else {
        // (2) Update as new product in the cart
        cartSlice.caseReducers.rollbackCartItem(state, {
          type: 'rollbackCartItem',
          payload: { cartItemId, case: 'isUpdating' },
        });
      }
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    removeCartItem: (
      state,
      action: PayloadAction<{ cartItemId: string; isRemoved: boolean }>
    ) => {
      const { cartItemId, isRemoved } = action.payload;
      // Case: Completed removing an item (Database response as success)
      if (isRemoved) {
        // Clear removed item backup
        cartSlice.caseReducers.clearCartItemBackup(state, {
          type: 'clearCartItemBackup',
          payload: { cartItemId, case: 'isRemoving' },
        });
      } else {
        // Case: Optimistic response
        // Back up cart item as removed item
        cartSlice.caseReducers.backUpCartItem(state, {
          type: 'backUpCartItem',
          payload: { cartItemId, case: 'isRemoving' },
        });
        // Remove cart item from cart
        delete state.cartItems[cartItemId];
      }
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    rollbackRemoveCartItem: (
      state,
      action: PayloadAction<{ cartItemId: string }>
    ) => {
      const { cartItemId } = action.payload;
      // Rollback removed cart item
      cartSlice.caseReducers.rollbackCartItem(state, {
        type: 'rollbackCartItem',
        payload: { cartItemId, case: 'isRemoving' },
      });
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    backUpCartItem: (
      state,
      action: PayloadAction<{
        cartItemId: string;
        case: 'isUpdating' | 'isAdding' | 'isRemoving';
      }>
    ) => {
      const { cartItemId } = action.payload;
      const field = action.payload.case;

      switch (field) {
        case 'isUpdating': {
          const cartItem = state.cartItems[cartItemId];
          const oldState = { ...cartItem.state };
          Object.assign(cartItem, {
            _history: oldState,
            isUpdating: true,
          });
          break;
        }
        case 'isAdding': {
          const cartItem = state.cartItems[cartItemId];
          const oldState = { ...cartItem.state };
          Object.assign(cartItem, {
            _history: oldState,
          });
          break;
        }
        case 'isRemoving': {
          state._removedCartItem = {
            ...state._removedCartItem,
            [cartItemId]: state.cartItems[cartItemId],
          };
          break;
        }
        default:
          throw new Error(`Unsupported cart slice action - ${field}`);
      }
    },
    clearCartItemBackup: (
      state,
      action: PayloadAction<{
        cartItemId: string;
        case: 'isUpdating' | 'isAdding' | 'isRemoving';
      }>
    ) => {
      const { cartItemId } = action.payload;
      const field = action.payload.case;

      switch (field) {
        case 'isUpdating': {
          delete state.cartItems[cartItemId]._history;
          delete state.cartItems[cartItemId].isUpdating;
          break;
        }
        case 'isAdding': {
          delete state.cartItems[cartItemId]._history;
          break;
        }
        case 'isRemoving': {
          delete state._removedCartItem[cartItemId];
          break;
        }
        default:
          throw new Error(`Unsupported cart slice action - ${field}`);
      }
    },
    rollbackCartItem: (
      state,
      action: PayloadAction<{
        cartItemId: string;
        case: 'isUpdating' | 'isAdding' | 'isRemoving';
      }>
    ) => {
      const { cartItemId } = action.payload;
      const field = action.payload.case;

      switch (field) {
        case 'isUpdating': {
          const cartItem = state.cartItems[cartItemId];
          Object.assign(cartItem, { state: cartItem._history });
          // Delete backup
          delete cartItem.isUpdating;
          delete cartItem._history;
          break;
        }
        case 'isAdding': {
          const cartItem = state.cartItems[cartItemId];
          Object.assign(cartItem, { state: cartItem._history });
          // Delete backup
          delete cartItem._history;
          break;
        }
        case 'isRemoving': {
          state.cartItems = {
            ...state.cartItems,
            [cartItemId]: state._removedCartItem[cartItemId],
          };
          // Delete backup
          delete state._removedCartItem[cartItemId];
          break;
        }
        default:
          throw new Error(`Unsupported cart slice action - ${field}`);
      }
    },
    clearCart: (state, action: PayloadAction<{ isCleared: boolean }>) => {
      const { isCleared } = action.payload;
      // Case: Completed clearing cart
      if (isCleared) {
        // Clearing backup
        state._removedCart = {};
        state._removedCartItem = {};
      } else {
        // Case: In the process of clearing cart
        // Backup data before clearing
        const cart = { ...state.cartItems };
        state._removedCart = cart;
        // Clearing cart
        state.cartItems = {};
        state.totalQuantity = 0;
        state.subtotal = 0;
      }
    },
    rollbackClearCart: (state) => {
      // Rollback old cart
      state.cartItems = { ...state._removedCart };
      // Clearing backup
      state._removedCart = {};
      // Re-calculate cart
      cartSlice.caseReducers.calculateCart(state);
    },
    calculateCart: (state) => {
      // Calculate total quantity and subtotal
      const cartItems = state.cartItems;
      const { totalQuantity, subtotal } = Object.values(cartItems).reduce(
        (acc, item) => {
          const { totalQuantity, subtotal } = acc;

          const { quantity, variantId } = item.state;
          const { price } = item.data;
          const { discount } = item.options.find(
            (item) => item.id === variantId
          )!;

          return {
            totalQuantity: totalQuantity + quantity,
            subtotal: subtotal + price * (1 - discount / 100) * quantity,
          };
        },
        {
          totalQuantity: 0,
          subtotal: 0,
        }
      );
      // Update total quantity and subtotal of cart
      state.totalQuantity = totalQuantity;
      state.subtotal = subtotal;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getFreshCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFreshCart.fulfilled, (state, action) => {
        return { ...state, ...action.payload, isLoading: false };
      })
      .addCase(getFreshCart.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.error.message);
      });
  },
});

export const {
  setCartState,
  addCartItem,
  setCartItem,
  cancelUpdateCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
  rollbackAddCartItem,
  rollbackUpdateCartItem,
  rollbackRemoveCartItem,
  rollbackClearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
