import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';


export const selectUsersState = (state: RootState) => state.users;


export const selectUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.users
);


export const selectUsersLoading = createSelector(
  [selectUsersState],
  (usersState) => usersState.isLoading
);


export const selectUsersError = createSelector(
  [selectUsersState],
  (usersState) => usersState.error
);


export const selectAllUsersData = createSelector(
  [selectUsers, selectUsersLoading, selectUsersError],
  (users, isLoading, error) => ({
    users,
    isLoading,
    error
  })
);
