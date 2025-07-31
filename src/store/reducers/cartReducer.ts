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

    addOrUpdateCartItem: (state, action: any) => {
      const existingIndex = state.items.findIndex(
        (item: any) => item.productId === action.payload.productId,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity = action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
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

    removeFromCart: (state, action: any) => {
      state.items = state.items.filter(
        (item: any) => item.productId !== action.payload,
      );
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  addOrUpdateCartItem,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
