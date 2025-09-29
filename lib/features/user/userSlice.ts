import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StateType = {
  isLoading: boolean;
  username: string | null | undefined;
  image: string | null | undefined;
};
const initialState: StateType = {
  isLoading: true,
  username: undefined,
  image: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadingUser: (state) => {
      state.isLoading = true;
    },
    setUser: (state, action: PayloadAction<Partial<StateType>>) => {
      const { username, image } = action.payload;
      state.username = username;
      state.image = image;
      state.isLoading = false;
    },
  },
});

export const { loadingUser, setUser } = userSlice.actions;
export default userSlice.reducer;
