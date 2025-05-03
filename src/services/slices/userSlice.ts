import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../../src/utils/cookie';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  error: null | string;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      setCookie('refreshToken', response.refreshToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (err) {
      return rejectWithValue('Неверный email или пароль');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка регистрации');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(data);
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user;
    } catch (err) {
      return rejectWithValue('Ошибка обновления профиля');
    }
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  localStorage.clear();
  return response;
});

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    if (getCookie('refreshToken')) {
      getUserApi()
        .then((res) => dispatch(setUser(res.user)))
        .finally(() => dispatch(setIsAuthChecked(true)));
    } else {
      dispatch(setIsAuthChecked(true));
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
  selectors: {
    getUserSelector: (state) => state.user,
    getErrorSelector: (state) => state.error,
    getIsAuthCheckedSelector: (state) => state.isAuthChecked
  }
});

export const userSliceReducer = userSlice.reducer;
export const { setIsAuthChecked, setUser } = userSlice.actions;
export default userSlice;
export const { getUserSelector, getErrorSelector, getIsAuthCheckedSelector } =
  userSlice.selectors;
