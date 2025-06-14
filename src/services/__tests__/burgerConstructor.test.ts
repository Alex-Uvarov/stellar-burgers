import {
  addIngredient,
  burgerConstructorSliceReducer,
  clearConstructor,
  deleteIngredient,
  getBun,
  getBurgerIngredients,
  burgerConstructorInitialState,
  moveIngredientDown,
  moveIngredientUp,
  TBurgerConstructorState
} from '../slices/burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const mockBunA: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  id: '1'
};

const mockBunB: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  id: '2'
};

const mockIngredientA: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  id: '3'
};

const mockIngredientB: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  id: '4'
};

const burger: TBurgerConstructorState = {
  bun: mockIngredientA,
  ingredients: [mockIngredientA]
};

describe('Конструктор', () => {
  it('Начальное состояние', () => {
    const state = burgerConstructorSliceReducer(undefined, { type: '' });
    expect(state).toEqual(burgerConstructorInitialState);
  });

  describe('Добавление ингредиентов', () => {
    it('Добавление булки', () => {
      const state = burgerConstructorSliceReducer(
        burgerConstructorInitialState,
        addIngredient(mockBunA)
      );
      expect(state.bun?._id).toEqual(mockBunA._id);
    });
    it('Изменение булки', () => {
      const stateBeforeChange = burger;
      const newBun = mockBunB;
      expect(stateBeforeChange.bun?._id).not.toEqual(newBun._id);
      const newState = burgerConstructorSliceReducer(
        stateBeforeChange,
        addIngredient(newBun)
      );
      expect(newState.bun?._id).toEqual(newBun._id);
    });
    it('Добавление ингредиента в пустой конструктор', () => {
      const state = burgerConstructorSliceReducer(
        burgerConstructorInitialState,
        addIngredient(mockIngredientB)
      );
      expect(state.ingredients.length).toEqual(1);
      expect(state.ingredients[0]._id).toEqual(mockIngredientB._id);
    });
    it('Добавление ингредиента в непустой конструктор', () => {
      const state = burger;
      const newState = burgerConstructorSliceReducer(
        state,
        addIngredient(mockIngredientB)
      );
      expect(state.ingredients.length).toEqual(1);
      expect(newState.ingredients.length).toEqual(2);
      expect(newState.ingredients[0]._id).toEqual(state.ingredients[0]._id);
      expect(newState.ingredients[newState.ingredients.length - 1]._id).toEqual(
        mockIngredientB._id
      );
    });
  });

  describe('Действия с ингредиентами в конструкторе', () => {
    it('Удаление ингредиента', () => {
      const state = burger;
      const newState = burgerConstructorSliceReducer(
        state,
        deleteIngredient(0)
      );

      expect(newState.ingredients.length).toEqual(state.ingredients.length - 1);
      expect(newState.ingredients).not.toContainEqual(state.ingredients[0]);
    });
    it('Перемещение ингредиента вверх', () => {
      const state = burgerConstructorSliceReducer(
        burger,
        addIngredient(mockIngredientB)
      );

      const newState = burgerConstructorSliceReducer(
        state,
        moveIngredientUp(1)
      );

      expect(newState.ingredients[0]._id).toEqual(state.ingredients[1]._id);
      expect(newState.ingredients[1]._id).toEqual(state.ingredients[0]._id);
    });
    it('Перемещение ингредиента вниз', () => {
      const state = burgerConstructorSliceReducer(
        burger,
        addIngredient(mockIngredientB)
      );

      const newState = burgerConstructorSliceReducer(
        state,
        moveIngredientDown(0)
      );

      expect(newState.ingredients[0]._id).toEqual(state.ingredients[1]._id);
      expect(newState.ingredients[1]._id).toEqual(state.ingredients[0]._id);
    });
    it('Очистка конструктора', () => {
      const state = burger;

      const newState = burgerConstructorSliceReducer(state, clearConstructor());

      expect(newState).not.toEqual(state);
      expect(newState).toEqual(burgerConstructorInitialState);
    });
  });

  describe('Тесты селекторов', () => {
    it('Получение ингредиентов', () => {
      const data = getBurgerIngredients({ burgerConstructor: burger });
      expect(data).toEqual(burger.ingredients);
    });
    it('Получение булки', () => {
      const data = getBun({ burgerConstructor: burger });
      expect(data).toEqual(burger.bun);
    });
  });
});
