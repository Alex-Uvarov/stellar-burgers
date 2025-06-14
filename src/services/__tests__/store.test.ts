import { burgerConstructorInitialState } from '../slices/burgerConstructorSlice';
import { burgerIngredientsInitialState } from '../slices/burgerIngredientsSlice';
import { feedInitialState } from '../slices/feedSlice';
import { orderInitialState } from '../slices/orderCreateSlice';
import { profileOrderInitialState } from '../slices/profileOrderSlice';
import { userInitialState } from '../slices/userSlice';
import { rootReducer } from '../store';
import { configureStore } from '@reduxjs/toolkit';

describe('Проверка rootReducer', () => {
  it('Инициализация', () => {
    const initialState = {};
    const action = { type: '@INIT' };

    const newState = rootReducer(initialState, action);

    expect(newState.user).toStrictEqual(userInitialState);
    expect(newState.burgerConstructor).toStrictEqual(
      burgerConstructorInitialState
    );
    expect(newState.ingredients).toStrictEqual(burgerIngredientsInitialState);
    expect(newState.profileOrders).toStrictEqual(profileOrderInitialState);
    expect(newState.order).toStrictEqual(orderInitialState);
    expect(newState.feed).toStrictEqual(feedInitialState);
  });

  it('Создание стора', () => {
    const store = configureStore({ reducer: rootReducer });

    const expectedInitialState = {
      user: userInitialState,
      burgerConstructor: burgerConstructorInitialState,
      ingredients: burgerIngredientsInitialState,
      profileOrders: profileOrderInitialState,
      order: orderInitialState,
      feed: feedInitialState
    };

    expect(store.getState()).toEqual(expectedInitialState);
  });
});
