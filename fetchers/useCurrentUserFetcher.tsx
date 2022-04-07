import React from 'react';
import { Jwt, ResponseSuccess, User } from '@interfaces';
import { axios } from '@utils';

export const useCurrentUserFetcher = () => {
    const [state, setState] = React.useState<{
        user: User;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        errorMessage: undefined,
        isLoading: false,
        user: undefined,
    });

    const fetch = React.useCallback(async (jwt: Jwt) => {
        setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: undefined }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<User>>('/api/users/current', {
                headers: {
                    Authorization: `Bearer ${jwt.token}`,
                },
            });
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                user: data,
            }));
        } catch (e) {
            let errorMessage: string | undefined = undefined;
            if (e.response) {
                const { data } = e.response;
                errorMessage = data.message || data.detail;
            }
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage }));
        }
    }, []);

    return { ...state, fetch };
};
