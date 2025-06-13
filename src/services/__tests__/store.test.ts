import { rootReducer } from '../store';
import { configureStore } from '@reduxjs/toolkit';

describe('Проверка rootReducer', () => {
  it('Инициализация', () => {
    const initialState = {};
    const action = { type: '@INIT' };

    const newState = rootReducer(initialState, action);

    expect(newState).toHaveProperty('user');
    expect(newState).toHaveProperty('burgerConstructor');
    expect(newState).toHaveProperty('ingredients');
    expect(newState).toHaveProperty('profileOrders');
    expect(newState).toHaveProperty('order');
    expect(newState).toHaveProperty('feed');
  });

  it('Создание стора', () => {
    const store = configureStore({ reducer: rootReducer });

    const expectedInitialState = {
      user: { user: null, isAuthChecked: false, error: null, loading: false },
      burgerConstructor: { bun: null, ingredients: [] },
      ingredients: { ingredients: [], loading: false, error: null },
      profileOrders: { orders: [], loading: false, error: null },
      order: { order: null, orderByNumber: null, loading: false, error: null },
      feed: { orders: [], total: 0, totalToday: 0, loading: false, error: null }
    };

    expect(store.getState()).toEqual(expectedInitialState);
  });
});
