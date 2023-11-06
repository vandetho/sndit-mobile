import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Jwt, ResponseSuccess, User } from '@interfaces';
import Constants from 'expo-constants';
import { RootState } from '@stores';

export const userLogin = createAsyncThunk('user/login', async ({ email, password }: LoginData, { rejectWithValue }) => {
    try {
        const { data } = await axios.post<{ token: string; refreshToken: string }>(
            `${Constants.expoConfig?.extra?.host}login_check`,
            {
                email,
                password,
            },
        );
        return data;
    } catch (e) {
        const error = e as any;
        if (error.response) {
            const {
                response: { data },
            } = error;
            return rejectWithValue(data.message || data.detail);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const userRefreshToken = createAsyncThunk(
    'user/refreshToken',
    async ({ refreshToken }: { refreshToken: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<{ token: string; refreshToken: string }>(
                `${Constants.expoConfig?.extra?.host}token/refresh`,
                {
                    refreshToken,
                },
            );
            return data;
        } catch (e) {
            const error = e as any;
            if (error.response) {
                const {
                    response: { data },
                } = error;
                return rejectWithValue(data.message || data.detail);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const userChangePassword = createAsyncThunk(
    'user/change-password',
    async ({ currentPassword, password, confirmPassword }: ChangePassword, { rejectWithValue }) => {
        try {
            const { data } = await axios.put<ResponseSuccess<null>>(
                `${Constants.expoConfig?.extra?.host}users/change-password`,
                {
                    currentPassword: currentPassword,
                    plainPassword: { first: password, second: confirmPassword },
                },
            );
            return data;
        } catch (e) {
            const error = e as any;
            if (error.response) {
                const {
                    response: { data },
                } = error;
                return rejectWithValue(data.message || data.detail);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);
export const userRegister = createAsyncThunk(
    'user/register',
    async ({ firstName, lastName, email, password, agreeTerms }: RegisterData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<ResponseSuccess<number>>(`${Constants.expoConfig?.extra?.host}register`, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                plainPassword: password,
                agreeTerms: agreeTerms,
            });
            return data;
        } catch (e) {
            const error = e as any;
            if (error.response) {
                const {
                    response: { data },
                } = error;
                return rejectWithValue(data.message || data.detail);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);
export const userVerifyEmail = createAsyncThunk(
    'user/verify',
    async (params: { [key: string]: any }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<ResponseSuccess<User>>(
                `${Constants.expoConfig?.extra?.host}verify`,
                params,
            );
            return data;
        } catch (e) {
            const error = e as any;
            if (error.response) {
                const {
                    response: { data },
                } = error;
                return rejectWithValue(data.message || data.detail);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);
export const userResentEmail = createAsyncThunk('user/resent', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await axios.post<ResponseSuccess<User>>(`${Constants.expoConfig?.extra?.host}resent`, { id });
        return data;
    } catch (e) {
        const error = e as any;
        if (error.response) {
            const {
                response: { data },
            } = error;
            return rejectWithValue(data.message || data.detail);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const userForgotPassword = createAsyncThunk(
    'user/forgot-password',
    async (email: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<ResponseSuccess<User>>(
                `${Constants.expoConfig?.extra?.host}reset-password`,
                { email },
            );
            return data;
        } catch (e) {
            const error = e as any;
            if (error.response) {
                const {
                    response: { data },
                } = error;
                return rejectWithValue(data.message || data.detail);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);
export const userResetPassword = createAsyncThunk(
    'user/reset-password',
    async ({ password, confirmPassword, token }: ChangePassword & { token: string }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post<ResponseSuccess<User>>(
                `${Constants.expoConfig?.extra?.host}reset-password/reset`,
                {
                    plainPassword: { first: password, second: confirmPassword },
                    token,
                },
            );
            return data;
        } catch (e) {
            const error = e as any;
            if (error.response) {
                const {
                    response: { data },
                } = error;
                return rejectWithValue(data.message || data.detail);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

const defaultValue = {
    isRefreshing: false,
    loading: false,
    error: undefined,
    resendError: undefined,
    resetPasswordError: undefined,
    forgotPasswordError: undefined,
    changePasswordError: undefined,
    verifyEmailError: undefined,
    refreshTokenError: undefined,
    registerError: undefined,
    message: undefined,
    resendMessage: undefined,
    registerMessage: undefined,
    forgotPasswordMessage: undefined,
    verifyEmailMessage: undefined,
    changePasswordMessage: undefined,
    resetPasswordMessage: undefined,
    success: false,
    logoutSuccess: false,
    registerSuccess: false,
    resendSuccess: false,
    resetPasswordSuccess: false,
    forgotPasswordSuccess: false,
    changePasswordSuccess: false,
    verifyEmailSuccess: false,
};

const initialState: {
    isRefreshing: boolean;
    loading: boolean;
    error: string | undefined;
    resendError: string | undefined;
    resetPasswordError: string | undefined;
    forgotPasswordError: string | undefined;
    changePasswordError: string | undefined;
    refreshTokenError: string | undefined;
    verifyEmailError: string | undefined;
    registerError: string | undefined;
    message: string | undefined;
    resendMessage: string | undefined;
    changePasswordMessage: string | undefined;
    verifyEmailMessage: string | undefined;
    forgotPasswordMessage: string | undefined;
    registerMessage: string | undefined;
    resetPasswordMessage: string | undefined;
    success: boolean;
    resendSuccess: boolean;
    resetPasswordSuccess: boolean;
    forgotPasswordSuccess: boolean;
    changePasswordSuccess: boolean;
    verifyEmailSuccess: boolean;
    logoutSuccess: boolean;
    registerSuccess: boolean;
    jwt: Jwt | undefined;
    isLogged: boolean;
    userId: number | undefined;
} = {
    ...defaultValue,
    isRefreshing: true,
    isLogged: false,
    jwt: undefined,
    userId: undefined,
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Jwt>) => {
            state.jwt = action.payload;
            state.isLogged = true;
        },
        setIsRefreshing: (state, action: PayloadAction<boolean>) => {
            state.isRefreshing = action.payload;
        },
        logout: (state) => {
            state.logoutSuccess = true;
            state.isLogged = false;
            state.jwt = undefined;
            AuthStorage.signOut().then();
        },
    },
    extraReducers: ({ addCase }) => {
        addCase(userLogin.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userLogin.fulfilled, (state, { payload }: PayloadAction<{ token: string; refreshToken: string }>) => {
            state.loading = false;
            state.success = true;
            state.isLogged = true;
            state.jwt = { ...payload, createdAt: new Date(), user: undefined };
            AuthStorage.storeAuthentication(state.jwt).then();
        });
        addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = String(action.payload);
        });
        addCase(userRefreshToken.pending, (state) => {
            Object.assign(state, { ...defaultValue, isRefreshing: true });
        });
        addCase(
            userRefreshToken.fulfilled,
            (state, { payload }: PayloadAction<{ token: string; refreshToken: string }>) => {
                state.isRefreshing = false;
                state.isLogged = true;
                state.jwt = {
                    token: payload.token,
                    refreshToken: payload.refreshToken,
                    createdAt: new Date(),
                    user: state.jwt?.user,
                };
                AuthStorage.storeAuthentication(state.jwt).then();
            },
        );
        addCase(userRefreshToken.rejected, (state, action) => {
            state.isRefreshing = false;
            state.refreshTokenError = String(action.payload);
        });
        addCase(userChangePassword.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userChangePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.changePasswordSuccess = true;
            state.changePasswordMessage = action.payload.message;
        });
        addCase(userChangePassword.rejected, (state, action) => {
            state.loading = false;
            state.changePasswordError = String(action.payload);
        });
        addCase(userResentEmail.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userResentEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.resendSuccess = true;
            state.resendMessage = action.payload.message;
        });
        addCase(userResentEmail.rejected, (state, action) => {
            state.loading = false;
            state.resendError = String(action.payload);
        });
        addCase(userVerifyEmail.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userVerifyEmail.fulfilled, (state, action) => {
            state.loading = false;
            state.verifyEmailSuccess = true;
            state.verifyEmailMessage = action.payload.message;
        });
        addCase(userVerifyEmail.rejected, (state, action) => {
            state.loading = false;
            state.verifyEmailError = String(action.payload);
        });
        addCase(userRegister.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userRegister.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.userId = payload.data;
            state.registerSuccess = true;
            state.registerMessage = payload.message;
        });
        addCase(userRegister.rejected, (state, action) => {
            state.loading = false;
            state.registerError = String(action.payload);
        });
        addCase(userForgotPassword.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userForgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.forgotPasswordSuccess = true;
            state.forgotPasswordMessage = action.payload.message;
        });
        addCase(userForgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.forgotPasswordError = String(action.payload);
        });
        addCase(userResetPassword.pending, (state) => {
            Object.assign(state, { ...defaultValue, loading: true });
        });
        addCase(userResetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.resetPasswordSuccess = true;
            state.resetPasswordMessage = action.payload.message;
        });
        addCase(userResetPassword.rejected, (state, action) => {
            state.loading = false;
            state.resetPasswordError = String(action.payload);
        });
    },
});

export const isUserLogged = ({ userSlice }: RootState) => userSlice.isLogged;
export const isRefreshingToken = ({ userSlice }: RootState) => userSlice.isRefreshing;
export const getJWT = ({ userSlice }: RootState) => userSlice.jwt;
export const isLogging = ({ userSlice }: RootState) => userSlice.loading;
export const isSuccess = ({ userSlice }: RootState) => userSlice.success;
export const getRegisterMessage = ({ userSlice }: RootState) => userSlice.registerMessage;
export const isRegisterSuccess = ({ userSlice }: RootState) => userSlice.registerSuccess;
export const getRegisterError = ({ userSlice }: RootState) => userSlice.registerError;
export const isLogoutSuccess = ({ userSlice }: RootState) => userSlice.logoutSuccess;
export const getError = ({ userSlice }: RootState) => userSlice.error;
export const getMessage = ({ userSlice }: RootState) => userSlice.message;
export const getUserId = ({ userSlice }: RootState) => userSlice.userId;
export const isResendSuccess = ({ userSlice }: RootState) => userSlice.resendSuccess;
export const getResendError = ({ userSlice }: RootState) => userSlice.resendError;
export const getResendMessage = ({ userSlice }: RootState) => userSlice.resendMessage;
export const isVerifyEmailSuccess = ({ userSlice }: RootState) => userSlice.verifyEmailSuccess;
export const getVerifyEmailError = ({ userSlice }: RootState) => userSlice.verifyEmailError;

export const {
    actions: { setCredentials, logout, setIsRefreshing },
} = userSlice;
