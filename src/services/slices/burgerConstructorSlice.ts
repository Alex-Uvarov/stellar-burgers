import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

export type IngredientWithId = TIngredient & { id: string };

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return {
          payload: { ...ingredient, id }
        };
      }
    },
    deleteIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1]
      ];
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    getBurgerIngredients: (state) => state.ingredients,
    getBun: (state) => state.bun
  }
});

export const burgerConstructorSliceReducer = burgerConstructorSlice.reducer;
export const {
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = burgerConstructorSlice.actions;
export const { getBurgerIngredients, getBun } =
  burgerConstructorSlice.selectors;
export default burgerConstructorSlice;
