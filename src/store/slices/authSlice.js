// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../api/authService';

// login thunk: calls API, saves token, fetches user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, isEmployee = true }, { rejectWithValue }) => {
    try {
      const data = await authService.loginRequest({ email, password, isEmployee });
      const token = data?.token ?? data?.accessToken ?? null;
      if (!token) return rejectWithValue({ message: 'No token in response' });

      // save the token
      authService.saveTokenToStorage(token);

      // get user info
      const user = await authService.fetchUserRequest(token);
      return { user, token };
    } catch (err) {
      return rejectWithValue({ status: err.status || 500, message: err.data?.message || err.message || 'Login failed' });
    }
  }
);

// fetchCurrentUser: used at app start or when page reloads
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = authService.readTokenFromStorage();
      if (!token) return rejectWithValue({ message: 'No token' });

      const user = await authService.fetchUserRequest(token);
      return { user, token };
    } catch (err) {
      // token invalid or expired -> remove it
      authService.removeTokenFromStorage();
      return rejectWithValue({ status: err.status || 500, message: err.data?.message || err.message || 'Failed to fetch user' });
    }
  }
);

// logout thunk (keeps it async-friendly)
export const logout = createAsyncThunk('auth/logout', async (_, { fulfillWithValue }) => {
  authService.removeTokenFromStorage();
  return fulfillWithValue({});
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle', // idle | loading | authenticated | unauthenticated | failed
    error: null,
  },
  reducers: {
    setUser(state, action) { state.user = action.payload; },
    clearError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => { state.status = 'loading'; state.error = null; });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload?.message || 'Login failed';
      state.user = null;
      state.token = null;
    });

    // fetchCurrentUser
    builder.addCase(fetchCurrentUser.pending, (state) => { state.status = 'loading'; state.error = null; });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.status = 'authenticated';
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.status = 'unauthenticated';
      state.user = null;
      state.token = null;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.status = 'unauthenticated';
      state.user = null;
      state.token = null;
      state.error = null;
    });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
