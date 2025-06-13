import {
  clearOrder,
  getErrorSelector,
  getLoadingStateSelector,
  getOrderByNumber,
  getOrderByNumberSelector,
  getOrderSelector,
  initialState,
  orderReducer,
  sendOrder
} from '../slices/orderCreateSlice';

const mockOrderData = {
  order: {
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
  },
  orderByNumber: {
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
  },
  loading: false,
  error: null
};

describe('Заказ', () => {
  it('Начальное состояние', () => {
    const state = orderReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('Редюсеры', () => {
    it('Очистка заказа', () => {
      const state = mockOrderData;
      const newState = orderReducer(state, clearOrder());
      expect(newState).toStrictEqual(initialState);
    });
  });

  describe('Сервер', () => {
    it('Отправка заказа pending', () => {
      const result = orderReducer(
        initialState,
        sendOrder.pending('RequestId', mockOrderData.order.ingredients)
      );
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
    it('Заказ отправлен fulfilled', () => {
      const result = orderReducer(
        initialState,
        sendOrder.fulfilled(
          {
            order: mockOrderData.order,
            name: mockOrderData.order.name,
            success: true
          },
          'requestId',
          mockOrderData.order.ingredients
        )
      );
      expect(result.order).toStrictEqual(mockOrderData.order);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
    it('Ошибка отправки заказа', () => {
      const result = orderReducer(
        initialState,
        sendOrder.rejected(
          new Error('Err'),
          'requestId',
          mockOrderData.order.ingredients
        )
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBe(
        sendOrder.rejected(
          new Error('Err'),
          'requestId',
          mockOrderData.order.ingredients
        ).error?.message ?? 'Err'
      );
    });
    it('Получение заказа по номеру pending', () => {
      const result = orderReducer(
        initialState,
        getOrderByNumber.pending('requestId', mockOrderData.order.number)
      );
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
    it('Получение заказа по номеру fulfilled', () => {
      const result = orderReducer(
        initialState,
        getOrderByNumber.fulfilled(
          { orders: [mockOrderData.order], success: true },
          'requestId',
          mockOrderData.order.number
        )
      );
      expect(result.orderByNumber).toStrictEqual(mockOrderData.order);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
    it('Получение заказа по номеру rejected', () => {
      const result = orderReducer(
        initialState,
        getOrderByNumber.rejected(
          new Error('Err'),
          'requestID',
          mockOrderData.order.number
        )
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBe(
        getOrderByNumber.rejected(
          new Error('Err'),
          'requestId',
          mockOrderData.order.number
        ).error?.message ?? 'Err'
      );
    });
  });

  describe('Селекторы', () => {
    it('Получение заказа', () => {
      const result = getOrderSelector({ order: mockOrderData });
      expect(result).toStrictEqual(mockOrderData.order);
    });
    it('Получение статуса загрузки', () => {
      const result = getLoadingStateSelector({ order: mockOrderData });
      expect(result).toBe(mockOrderData.loading);
    });
    it('Получение ошибки', () => {
      const result = getErrorSelector({ order: mockOrderData });
      expect(result).toBe(mockOrderData.error);
    });
    it('Получение заказа, найденного по номеру', () => {
      const result = getOrderByNumberSelector({ order: mockOrderData });
      expect(result).toBe(mockOrderData.orderByNumber);
    });
  });
});
