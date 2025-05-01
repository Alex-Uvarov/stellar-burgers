import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  getIsAuthCheckedSelector,
  getUserSelector
} from '../../../src/services/slices/userSlice';
import { useSelector } from '../../../src/services/store';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

const ProtectedRoute = ({
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
    const from = location.state?.from || { pathname: '/' };
    return (
      <Navigate
        to={from}
        state={{
          from: { location }
        }}
      />
    );
  }

  return children;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({ children }: { children: React.ReactElement }) => (
  <ProtectedRoute onlyUnAuth children={children} />
);
