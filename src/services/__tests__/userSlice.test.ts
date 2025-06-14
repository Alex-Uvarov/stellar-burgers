import {
  getErrorSelector,
  getIsAuthCheckedSelector,
  getUserSelector,
  userInitialState,
  loginUser,
  logoutUser,
  registerUser,
  setIsAuthChecked,
  setUser,
  updateUser,
  userSliceReducer
} from '../slices/userSlice';

const mockUserData = {
  user: {
    email: '123@yandex.ru',
    name: 'Alex'
  },
  isAuthChecked: true,
  error: null,
  loading: false
};

const registerData = {
  email: '123@yandex.com',
  name: 'Alex',
  password: '123'
};

describe('Пользователь', () => {
  it('Начальное состояние', () => {
    const state = userSliceReducer(undefined, { type: '' });
    expect(state).toEqual(userInitialState);
  });

  describe('Редюсеры', () => {
    it('setIsAuthChecked', () => {
      const state = mockUserData;
      const newState = userSliceReducer(
        state,
        setIsAuthChecked(!state.isAuthChecked)
      );
      expect(newState.isAuthChecked).toBe(!state.isAuthChecked);
    });
    it('setUser', () => {
      const state = userInitialState;
      const newState = userSliceReducer(state, setUser(mockUserData.user));
      expect(newState.user).toStrictEqual(mockUserData.user);
    });
  });

  describe('Сервер', () => {
    describe('Login user', () => {
      it('Login User Pending', () => {
        const result = userSliceReducer(
          userInitialState,
          loginUser.pending('requestID', {
            email: mockUserData.user.email,
            password: '123'
          })
        );
        expect(result.error).toBeNull();
        expect(result.loading).toBe(true);
        expect(result.isAuthChecked).toBe(false);
      });
      it('LoginUser Rejected', () => {
        const result = userSliceReducer(userInitialState, {
          type: loginUser.rejected.type,
          payload: 'Неверный email или пароль'
        });
        expect(result.loading).toBe(false);
        expect(result.error).toBe('Неверный email или пароль');
        expect(result.isAuthChecked).toBe(false);
      });
      it('Login User Fulfilled', () => {
        const result = userSliceReducer(userInitialState, {
          type: loginUser.fulfilled.type,
          payload: mockUserData
        });
        expect(result.user).toStrictEqual(mockUserData);
        expect(result.loading).toBe(false);
        expect(result.error).toBeNull();
        expect(result.isAuthChecked).toBe(true);
      });
    });

    describe('Register User', () => {
      it('Register User pending', () => {
        const result = userSliceReducer(
          userInitialState,
          registerUser.pending('requestId', registerData)
        );
        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
        expect(result.isAuthChecked).toBe(false);
      });
      it('Register User Rejected', () => {
        const result = userSliceReducer(userInitialState, {
          type: registerUser.rejected.type,
          payload: 'Ошибка регистрации'
        });
        expect(result.loading).toBe(false),
          expect(result.isAuthChecked).toBe(false),
          expect(result.error).toBe('Ошибка регистрации');
      });
      it('Register User Fulfilled', () => {
        const result = userSliceReducer(
          userInitialState,
          registerUser.fulfilled(mockUserData.user, 'requestId', registerData)
        );
        expect(result.error).toBeNull();
        expect(result.isAuthChecked).toBe(true);
        expect(result.loading).toBe(false);
        expect(result.user).toStrictEqual(mockUserData.user);
      });
    });

    describe('Update User', () => {
      it('Update User Pending', () => {
        const result = userSliceReducer(
          userInitialState,
          updateUser.pending('request', registerData)
        );
        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
      });
      it('Update User Rejected', () => {
        const result = userSliceReducer(userInitialState, {
          type: updateUser.rejected.type,
          payload: 'Ошибка обновления пользователя'
        });
        expect(result.loading).toBe(false);
        expect(result.error).toBe('Ошибка обновления пользователя');
      });
      it('Update User Fulfilled', () => {
        const result = userSliceReducer(
          userInitialState,
          updateUser.fulfilled(mockUserData.user, 'requestId', registerData)
        );
        expect(result.loading).toBe(false);
        expect(result.isAuthChecked).toBe(true);
        expect(result.error).toBeNull();
        expect(result.user).toStrictEqual(mockUserData.user);
      });
    });

    describe('Logout User', () => {
      it('Logout User Pending', () => {
        const result = userSliceReducer(
          userInitialState,
          logoutUser.pending('requestId')
        );
        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
      });
      it('Logout User Rejected', () => {
        const result = userSliceReducer(userInitialState, {
          type: logoutUser.rejected.type,
          payload: 'Ошибка выхода'
        });
        expect(result.error).toBe('Ошибка выхода');
        expect(result.loading).toBe(false);
      });
      it('Logout User Fulfilled', () => {
        const result = userSliceReducer(
          mockUserData,
          logoutUser.fulfilled({ success: true }, 'request')
        );
        expect(result.error).toBeNull();
        expect(result.loading).toBe(false);
        expect(result.isAuthChecked).toBe(false);
        expect(result.user).toStrictEqual(userInitialState.user);
      });
    });
  });

  describe('Селекторы', () => {
    it('Получение пользователя', () => {
      const result = getUserSelector({ user: mockUserData });
      expect(result).toStrictEqual(mockUserData.user);
    });
    it('Получение ошибки', () => {
      const result = getErrorSelector({ user: mockUserData });
      expect(result).toBe(mockUserData.error);
    });
    it('Получение статуса проверки авторизации', () => {
      const result = getIsAuthCheckedSelector({ user: mockUserData });
      expect(result).toBe(mockUserData.isAuthChecked);
    });
  });
});
