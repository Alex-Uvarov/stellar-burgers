import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../../src/services/store';
import { getUserSelector } from '../../../src/services/slices/userSlice';

export const AppHeader: FC = () => {
  const user = useSelector(getUserSelector);
  return <AppHeaderUI userName={user?.name} />;
};
