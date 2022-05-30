import React from 'react';
import { Package, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const usePackageFetcher = () => {
    const [state, setState] = React.useState<{
        item: Package;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        item: undefined,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async (idOrToken: string | number) => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<Package>>(`/api/packages/${idOrToken}`);
            setState((prevState) => ({ ...prevState, item: data, isLoading: false }));
        } catch (error) {
            if (!error.response) {
                console.error(error);
                return;
            }
            const {
                response: { data },
            } = error;

            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, []);

    return { ...state, fetch };
};
