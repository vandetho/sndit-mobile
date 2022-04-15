import React from 'react';
import { Company, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useCompanyFetcher = () => {
    const [state, setState] = React.useState<{
        company: Company;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        company: undefined,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async (idOrToken: string | number) => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<Company>>(`/api/companies/${idOrToken}`);
            setState((prevState) => ({ ...prevState, company: data, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, []);

    return { ...state, fetch };
};
