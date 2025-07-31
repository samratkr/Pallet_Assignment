import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      state.items.push(action.payload);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((p:any) => p.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
