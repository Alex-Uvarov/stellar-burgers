import {
  getLoadingSelector,
  getProfileOrders,
  getProfileOrdersSelector,
  initialState,
  profileOrdersSliceReducer
} from '../slices/profileOrderSlice';

const mockProfileOrdersData = {
  orders: [
    {
      _id: '1',
      status: 'Done',
      name: 'Краторный бургер',
      createdAt: '21.06.2025',
      updatedAt: '22.06.2025',
      number: 12345,
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093e'
      ]
    }
  ],
  loading: false,
  error: null
};

describe('Заказ в профиле', () => {
  it('Начальное состояние', () => {
    const state = profileOrdersSliceReducer(undefined, { type: '' });
    expect(state).toBe(initialState);
  });

  describe('Сервер', () => {
    it('getProfileOrders Pending', () => {
      const result = profileOrdersSliceReducer(
        initialState,
        getProfileOrders.pending('requestId')
      );
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
    it('getProfileOrders fulfilled', () => {
      const result = profileOrdersSliceReducer(
        initialState,
        getProfileOrders.fulfilled(mockProfileOrdersData.orders, 'requestId')
      );
      expect(result.orders).toStrictEqual(mockProfileOrdersData.orders);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
    it('getProfileOrders Rejected', () => {
      const result = profileOrdersSliceReducer(
        initialState,
        getProfileOrders.rejected(new Error('Err'), 'requestId')
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBe(
        getProfileOrders.rejected(new Error('Err'), 'requestId').error
          ?.message ?? 'Err'
      );
    });
  });

  describe('Селекторы', () => {
    it('Получение заказов профиля', () => {
      const result = getProfileOrdersSelector({
        profileOrders: mockProfileOrdersData
      });
      expect(result).toBe(mockProfileOrdersData.orders);
    });
    it('Получение статуса загрузки', () => {
      const result = getLoadingSelector({
        profileOrders: mockProfileOrdersData
      });
      expect(result).toBe(mockProfileOrdersData.loading);
    });
  });
});
