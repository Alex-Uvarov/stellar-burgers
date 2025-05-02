import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getIsAuthCheckedSelector,
  getUserSelector
} from '../../../src/services/slices/userSlice';
import { useSelector } from '../../../src/services/store';

type ProtectedRouteProps = {
  children: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const user = useSelector(getUserSelector);
  const isAuthChecked = useSelector(getIsAuthCheckedSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return (
      <Navigate
        to={'/login'}
        state={{
          from: { location }
        }}
      />
    );
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return children;
};
