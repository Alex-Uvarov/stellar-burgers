import {
  feedReducer,
  fetchFeed,
  getErrorSelector,
  getLoadingStateSelector,
  getOrdersSelector,
  getTotalSelector,
  getTotalToday,
  initialState,
  TFeedState
} from '../slices/feedSlice';

const mockFeed: TFeedState = {
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
  total: 21,
  totalToday: 10,
  loading: false,
  error: null
};

describe('Feed', () => {
  it('Начальное состояние', () => {
    const state = feedReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('Работа с сервером', () => {
    it('Pending', () => {
      const result = feedReducer(
        initialState,
        fetchFeed.pending('', undefined)
      );
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
    it('Fulfilled', () => {
      const result = feedReducer(
        initialState,
        fetchFeed.fulfilled(
          {
            orders: mockFeed.orders,
            total: mockFeed.total,
            totalToday: mockFeed.totalToday,
            success: true
          },
          ''
        )
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.orders).toStrictEqual(mockFeed.orders);
      expect(result.total).toBe(mockFeed.total);
      expect(result.totalToday).toBe(mockFeed.totalToday);
    });
    it('Rejected', () => {
      const result = feedReducer(
        initialState,
        fetchFeed.rejected(new Error('Err'), '')
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBe(
        fetchFeed.rejected(new Error('Err'), '').error?.message ?? 'Err'
      );
    });
  });

  describe('Тесты селекторов', () => {
    it('Получение заказов', () => {
      const result = getOrdersSelector({ feed: mockFeed });
      expect(result).toBe(mockFeed.orders);
    });
    it('Получение общего количества заказов', () => {
      const result = getTotalSelector({ feed: mockFeed });
      expect(result).toBe(mockFeed.total);
    });
    it('Получение общего количества заказов за день', () => {
      const result = getTotalToday({ feed: mockFeed });
      expect(result).toBe(mockFeed.totalToday);
    });
    it('Получение информации о статусе загрузки', () => {
      const result = getLoadingStateSelector({ feed: mockFeed });
      expect(result).toBe(mockFeed.loading);
    });
    it('Получение информации об ошибке', () => {
      const result = getErrorSelector({ feed: mockFeed });
      expect(result).toBe(mockFeed.error);
    });
  });
});
