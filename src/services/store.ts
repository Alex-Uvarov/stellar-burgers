import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSliceReducer } from './slices/userSlice';
import { burgerConstructorSliceReducer } from './slices/burgerConstructorSlice';
import { ingredientsSliceReducer } from './slices/burgerIngredientsSlice';
import { profileOrdersSliceReducer } from './slices/profileOrderSlice';
import { orderReducer } from './slices/orderCreateSlice';
import { feedReducer } from './slices/feedSlice';

const rootReducer = combineReducers({
  user: userSliceReducer,
  burgerConstructor: burgerConstructorSliceReducer,
  ingredients: ingredientsSliceReducer,
  profileOrders: profileOrdersSliceReducer,
  order: orderReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
