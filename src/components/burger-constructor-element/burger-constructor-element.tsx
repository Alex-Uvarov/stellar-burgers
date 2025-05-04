import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../../src/services/store';
import burgerConstructorSlice from '../../../src/services/slices/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(
          burgerConstructorSlice.actions.moveIngredientDown(ingredient.id)
        );
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(
          burgerConstructorSlice.actions.moveIngredientUp(ingredient.id)
        );
      }
    };

    const handleClose = () => {
      dispatch(burgerConstructorSlice.actions.deleteIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
