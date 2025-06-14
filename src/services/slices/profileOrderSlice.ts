import { getOrdersApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TProfileOrderState = {
  orders: TOrder[];
  loading: boolean;
  error: null | string | undefined;
};

export const profileOrderInitialState: TProfileOrderState = {
  orders: [],
  loading: false,
  error: null
};

export const getProfileOrders = createAsyncThunk(
  'profileOrders/getProfileOrders',
  getOrdersApi
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState: profileOrderInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrders.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.orders = action.payload;
      });
  },
  selectors: {
    getProfileOrdersSelector: (state) => state.orders,
    getLoadingSelector: (state) => state.loading
  }
});

export const profileOrdersSliceReducer = profileOrdersSlice.reducer;
export const { getProfileOrdersSelector, getLoadingSelector } =
  profileOrdersSlice.selectors;
export default profileOrdersSlice;
