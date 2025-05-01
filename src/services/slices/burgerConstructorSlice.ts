import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

type TBurgerConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
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
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const current = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (current > 0) {
        const next = state.ingredients[current];
        state.ingredients[current] = state.ingredients[current - 1];
        state.ingredients[current - 1] = next;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const current = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (current !== -1 && current < state.ingredients.length - 1) {
        const next = state.ingredients[current];
        state.ingredients[current] = state.ingredients[current + 1];
        state.ingredients[current + 1] = next;
      }
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
export const { getBurgerIngredients, getBun } =
  burgerConstructorSlice.selectors;
export default burgerConstructorSlice;
