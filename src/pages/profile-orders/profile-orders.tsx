import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getLoadingSelector,
  getProfileOrders,
  getProfileOrdersSelector
} from '../../../src/services/slices/profileOrderSlice';
import { useDispatch, useSelector } from '../../../src/services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getProfileOrdersSelector);
  const isLoading = useSelector(getLoadingSelector);

  useEffect(() => {
    dispatch(getProfileOrders());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
