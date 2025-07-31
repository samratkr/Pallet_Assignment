import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import cartReducer from './reducers/cartReducer';
import productReducer from './reducers/productReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
