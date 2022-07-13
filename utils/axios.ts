import * as axiosPromise from 'axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import { Jwt } from '@interfaces';
import AuthStorage from './AuthStorage';

const axios = axiosPromise.default.create({
    baseURL: Constants.manifest.extra.host,
});

const RequestHandler = async (request: AxiosRequestConfig) => {
    request.headers.Authorization = `Bearer ${await AuthStorage.getToken()}`;
    return request;
};

const ErrorHandler = (error: any) => {
    return Promise.reject(error);
};

const ResponseHandler = (response: AxiosResponse) => {
    return response;
};

const ResponseErrorHandler = async (error: any) => {
    const {
        response: { status, data },
        config,
    } = error;

    if (
        status === 401 &&
        ['Invalid JWT Token', 'Expired JWT Token'].includes(data.message) &&
        !config.__isRetryRequest
    ) {
        config.__isRetryRequest = true;
        const refreshToken = await AuthStorage.getRefreshToken();
        axios
            .post<{ refreshToken: string; token: string }>('/api/token/refresh', {
                refreshToken,
            })
            .then(({ data }) => {
                const jwt: Jwt = { ...data, createdAt: new Date(), user: undefined };
                AuthStorage.storeAuthentication(jwt);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                return axios(config);
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
