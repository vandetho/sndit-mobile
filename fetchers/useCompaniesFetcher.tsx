import React from 'react';
import { Company, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useCompaniesFetcher = () => {
    const [state, setState] = React.useState<{
        companies: Company[];
        totalRows: number;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        companies: [],
        totalRows: 0,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<{ companies: Company[]; totalRows: number }>>('/api/companies');
            setState((prevState) => ({ ...prevState, ...data, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
            console.log({ data });
        }
    }, []);
    console.log(state.companies);
    React.useEffect(() => {
        (async () => fetch())();
    }, [fetch]);

    return { ...state, fetch };
};
