import React from 'react';
import { City, ResponseSuccess } from '@interfaces';
import { request } from '@utils';

export const useCitiesFetcher = () => {
    const [state, setState] = React.useState<{
        cities: City[];
        totalRows: number;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        cities: [],
        totalRows: 0,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await request.get<ResponseSuccess<{ cities: City[]; totalRows: number }>>('/api/cities');
            setState((prevState) => ({ ...prevState, ...data, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, []);

    React.useEffect(() => {
        (async () => fetch())();
    }, [fetch]);

    return { ...state, fetch };
};
