import { fetchMyFavoriteIds } from '@/utils/actions';
import {
  favoriteIndexSearch,
  removeItemFromArray,
  sortByProductId,
} from '@/utils/clientFunctions';
import { FetchMyFavoriteIdsType } from '@/utils/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

type StateType = {
  isLoading: boolean;
  favorites: FetchMyFavoriteIdsType;
};
const initialState: StateType = {
  isLoading: true,
  favorites: [],
};

export const getFavorites = createAsyncThunk(
  'favorite/getFavorites',
  async (_, thunkAPI) => {
    try {
      return fetchMyFavoriteIds();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch favorite products';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

// ⚠️ ProductId is used in StoreFavoriteButton
// to determine whether the product is favorite or not.
// Please always ensure that the productId is sorted in ascending order.
const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addFavorite: (
      state,
      action: PayloadAction<{ productId: string; favoriteId?: string }>
    ) => {
      const { productId, favoriteId } = action.payload;
      if (!favoriteId) {
        // CaseI: Optimistic response
        // Add favorite & Sort by productId
        const newFavorites = sortByProductId([
          ...state.favorites,
          { id: 'pending', productId },
        ]);
        state.favorites = [...newFavorites];
      } else {
        // CaseII: Persist success result
        // Find order in favorites by product id
        const favoriteIndex = favoriteIndexSearch(state.favorites, productId);
        // Update favorite id
        state.favorites[favoriteIndex].id = favoriteId;
      }
    },
    rollbackAddFavorite: (
      state,
      action: PayloadAction<{ productId: string }>
    ) => {
      const { productId } = action.payload;
      // Find order in favorites by product id
      const favoriteIndex = favoriteIndexSearch(state.favorites, productId);
      // Rollback favorite
      state.favorites = removeItemFromArray(state.favorites, favoriteIndex);
    },
    removeFavorite: (state, action: PayloadAction<{ productId: string }>) => {
      const { productId } = action.payload;
      // Find order in favorites by favorite id
      const favoriteIndex = favoriteIndexSearch(state.favorites, productId);
      // Remove favorite
      state.favorites = removeItemFromArray(state.favorites, favoriteIndex);
    },
    rollbackRemoveFavorite: (
      state,
      action: PayloadAction<{ productId: string; favoriteId: string }>
    ) => {
      const { productId, favoriteId } = action.payload;
      // Rollback & Sort by productId
      const newFavorites = sortByProductId([
        ...state.favorites,
        { id: favoriteId, productId },
      ]);
      state.favorites = [...newFavorites];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        favorites: action.payload,
      }))
      .addCase(getFavorites.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.error.message);
      });
  },
});

export const {
  addFavorite,
  removeFavorite,
  rollbackAddFavorite,
  rollbackRemoveFavorite,
} = favoriteSlice.actions;
export default favoriteSlice.reducer;
