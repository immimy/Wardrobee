import { Roles } from '@/types/globals';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StateType = {
  isLoading: boolean;
  username: string | null | undefined;
  image: string | null | undefined;
  role: (Roles | 'user') | undefined;
};
const initialState: StateType = {
  isLoading: true,
  username: undefined,
  image: undefined,
  role: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadingUser: (state) => {
      state.isLoading = true;
    },
    setUser: (state, action: PayloadAction<Partial<StateType>>) => {
      const data = action.payload;
      return { ...state, ...data, isLoading: false };
    },
  },
});

export const { loadingUser, setUser } = userSlice.actions;
export default userSlice.reducer;
