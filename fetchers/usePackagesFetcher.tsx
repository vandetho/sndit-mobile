import React from 'react';
import { Company, Package, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const usePackagesFetcher = () => {
    const [state, setState] = React.useState<{
        packages: Package[];
        companiesPackages: Package[];
        totalRows: number;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        packages: [],
        companiesPackages: [],
        totalRows: 0,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(`/api/packages`);
            setState((prevState) => ({ ...prevState, ...data, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, []);

    const fetchCompany = React.useCallback(async (company: Company) => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(
                `/api/${company.id}/packages`,
            );
            setState((prevState) => ({
                ...prevState,
                companiesPackages: data.packages,
                totalRows: data.totalRows,
                isLoading: false,
            }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, []);

    return { ...state, fetch, fetchCompany };
};
