import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../../src/services/store';
import {
  getUserSelector,
  loginUser
} from '../../../src/services/slices/userSlice';
import { getLoadingSelector } from '../../../src/services/slices/burgerIngredientsSlice';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(getLoadingSelector);
  const user = useSelector(getUserSelector);
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    dispatch(loginUser({ email, password }));
    navigate('/', { replace: true });
    e.preventDefault();
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
