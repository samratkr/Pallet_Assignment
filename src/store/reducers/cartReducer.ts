import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: Array<object>;
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: any) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: any) => {
      state.items = state.items.filter((p: any) => p.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
