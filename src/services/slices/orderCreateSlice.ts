import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  orderByNumber: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  orderByNumber: null,
  loading: false,
  error: null
};

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => getOrderByNumberApi(number)
);

export const orderCreateSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrder.pending, (state) => {
        state.order = null;
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(sendOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
        state.error = null;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderByNumber = action.payload.orders[0];
      });
  },
  selectors: {
    getOrderSelector: (state) => state.order,
    getLoadingStateSelector: (state) => state.loading,
    getErrorSelector: (state) => state.error,
    getOrderByNumberSelector: (state) => state.orderByNumber
  }
});

export const orderReducer = orderCreateSlice.reducer;
export const {
  getOrderSelector,
  getLoadingStateSelector,
  getErrorSelector,
  getOrderByNumberSelector
} = orderCreateSlice.selectors;
export default orderCreateSlice;
