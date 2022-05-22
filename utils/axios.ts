import * as axiosPromise from 'axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { Jwt } from '@interfaces';
import AuthStorage from './AuthStorage';
import request from './request';

const axios = axiosPromise.default.create({
    baseURL: Constants.manifest.extra.host,
});

const RequestHandler = async (request: AxiosRequestConfig) => {
    request.headers.Authorization = `Bearer ${await AuthStorage.getToken()}`;
    return request;
};

const ErrorHandler = (error) => {
    return Promise.reject(error);
};

const ResponseHandler = (response: AxiosResponse) => {
    return response;
};

const ResponseErrorHandler = async (error) => {
    const {
        response: { status, data },
        config: { originalRequest = { _retry: false } },
    } = error;
    console.log({ status, data, originalRequest });
    if (
        status === 401 &&
        ['Invalid JWT Token', 'Expired JWT Token'].includes(data.message) &&
        !originalRequest._retry
    ) {
        originalRequest._retry = true;
        const refreshToken = await AuthStorage.getRefreshToken();
        request
            .post<{ refreshToken: string }, AxiosResponse<{ refreshToken: string; token: string }>>(
                '/api/token/refresh',
                {
                    refreshToken,
                },
            )
            .then(({ status, data }) => {
                if (status === 201) {
                    const jwt: Jwt = { ...data, createdAt: new Date(), user: undefined };
                    AuthStorage.storeAuthentication(jwt);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                    return axios(originalRequest);
                }
            })
            .catch((error) => {
                console.warn(error);
                return Promise.reject(error);
            });
        return;
    }
    return Promise.reject(error);
};

axios.interceptors.request.use(
    (request) => RequestHandler(request),
    (error) => ErrorHandler(error),
);

axios.interceptors.response.use(
    (response) => ResponseHandler(response),
    (error) => ResponseErrorHandler(error),
);

export default axios;
