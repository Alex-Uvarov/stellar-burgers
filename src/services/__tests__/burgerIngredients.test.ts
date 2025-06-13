import {
  fetchIngredients,
  getIngredientsSelector,
  getLoadingSelector,
  ingredientsSliceReducer,
  initialState,
  TIngredientsState
} from '../slices/burgerIngredientsSlice';

const mockIngredients: TIngredientsState = {
  ingredients: [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa093e',
      name: 'Филе Люминесцентного тетраодонтимформа',
      type: 'main',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/meat-03.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
    }
  ],
  loading: false,
  error: null
};

describe('Ингредиенты', () => {
  it('Начальное состояние', () => {
    const state = ingredientsSliceReducer(undefined, { type: '' });
    expect(state).toEqual(initialState);
  });

  describe('Работа с сервером', () => {
    it('Pending', () => {
      const result = ingredientsSliceReducer(
        initialState,
        fetchIngredients.pending('', undefined)
      );
      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
    it('Fulfilled', () => {
      const result = ingredientsSliceReducer(
        initialState,
        fetchIngredients.fulfilled(mockIngredients.ingredients, '')
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
      expect(result.ingredients).toStrictEqual(mockIngredients.ingredients);
    });
    it('rejected', () => {
      const result = ingredientsSliceReducer(
        initialState,
        fetchIngredients.rejected(new Error('Err'), '')
      );
      expect(result.loading).toBe(false);
      expect(result.error).toBe(
        fetchIngredients.rejected(new Error('Err'), '').error?.message ?? 'Err'
      );
    });
  });

  describe('Тесты селекторов', () => {
    it('Получение ингредиентов', () => {
      const data = getIngredientsSelector({ ingredients: mockIngredients });
      expect(data).toEqual(mockIngredients.ingredients);
    });
    it('Получение информации о загрузке ингридиентов', () => {
      const loadingState = getLoadingSelector({ ingredients: mockIngredients });
      expect(loadingState).toEqual(mockIngredients.loading);
    });
  });
});
