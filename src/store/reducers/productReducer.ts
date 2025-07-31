import { createSlice } from '@reduxjs/toolkit';
import { GetProductApiHelper } from '../helpers/productApis';

interface ProductState {
  products: Product[];
  loading: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
  singleProduct: any;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image: string;
  barcode?: string;
  inStock?: boolean;
  category?: string;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  hasMore: true,
  page: 1,
  error: null,
  singleProduct: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Optional manual reducers if needed
    singleProduct: (state, action) => {
      state.singleProduct = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(GetProductApiHelper.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetProductApiHelper.fulfilled, (state, action) => {
        const newProducts = action?.payload?.data?.data ?? [];
        const isLastPage = newProducts?.length < 10;

        state.products = [...state.products, ...newProducts];
        state.page += 1;
        state.hasMore = !isLastPage;
        state.loading = false;
      })
      .addCase(GetProductApiHelper.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message ?? 'Failed to fetch products';
      });
  },
});
export const { singleProduct } = productSlice.actions;
export default productSlice.reducer;
