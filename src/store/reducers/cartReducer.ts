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
      const existing: any = state.items.find(
        (item: any) => item.productId === action.payload.productId,
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item: any = state.items.find(
        (item: any) => item.productId === action.payload.productId,
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item: any) => item.productId !== action.payload,
      );
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
