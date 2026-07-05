import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';


const selectOrdersState = (state: RootState) => state.orders;


export const selectOrders = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.orders || []
);


export const selectOrdersLoading = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.isLoading
);


export const selectOrdersError = createSelector(
  [selectOrdersState],
  (ordersState) => ordersState.error
);


export const selectAllOrdersData = createSelector(
  [selectOrders, selectOrdersLoading, selectOrdersError],
  (orders, isLoading, error) => ({
    orders,
    isLoading,
    error
  })
);
