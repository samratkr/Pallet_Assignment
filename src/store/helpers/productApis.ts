import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProductRequest {
  page: string;
  pageSize: string;
  storeLocationId: string;
}

export const GetProductApiHelper = createAsyncThunk<
  PayloadAction,
  ProductRequest
>('Product/Get', async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      'https://catalog-management-system-dev-872387259014.us-central1.run.app/cms/product/v2/filter/product',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.message);
    console.error('Details:', error.response?.data || error);
    return rejectWithValue(
      error.response?.data || { message: 'Failed to Get Products' },
    );
  }
});
