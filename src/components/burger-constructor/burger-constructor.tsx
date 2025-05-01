import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../../src/services/store';
import burgerConstructorSlice, {
  getBun,
  getBurgerIngredients
} from '../../../src/services/slices/burgerConstructorSlice';
import orderCreateSlice, {
  getLoadingStateSelector,
  getOrderSelector,
  sendOrder
} from '../../../src/services/slices/orderCreateSlice';
import { getUserSelector } from '../../../src/services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = {
    bun: useSelector(getBun),
    ingredients: useSelector(getBurgerIngredients)
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(getUserSelector);

  const orderRequest = useSelector(getLoadingStateSelector);

  const orderModalData = useSelector(getOrderSelector);

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      if (!constructorItems.bun || orderRequest) return;
      const order = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];
      dispatch(sendOrder(order));
    }
  };

  const closeOrderModal = () => {
    dispatch(burgerConstructorSlice.actions.clearConstructor());
    dispatch(orderCreateSlice.actions.clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
