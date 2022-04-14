import React from 'react';
import { Employee, Package, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useEmployeePackagesFetcher = () => {
    const [state, setState] = React.useState<{
        packages: Package[];
        companiesPackages: Package[];
        totalRows: number;
        isLoading: boolean;
        isLoadingMore: boolean;
        errorMessage: string | undefined;
        offset: number;
        limit: number;
    }>({
        packages: [],
        companiesPackages: [],
        totalRows: 0,
        isLoading: false,
        isLoadingMore: false,
        errorMessage: undefined,
        offset: 0,
        limit: 10,
    });

    const fetch = React.useCallback(
        async (employee: Employee) => {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            try {
                const {
                    data: { data },
                } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(
                    `/api/${employee.id}/packages`,
                    {
                        params: { offset: 0, limit: state.limit },
                    },
                );
                setState((prevState) => ({
                    ...prevState,
                    companiesPackages: data.packages,
                    totalRows: data.totalRows,
                    isLoading: false,
                    offset: prevState.limit,
                }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
            }
        },
        [state.limit],
    );

    const fetchMore = React.useCallback(
        async (employee: Employee) => {
            setState((prevState) => ({ ...prevState, isLoadingMore: true }));
            try {
                const {
                    data: { data },
                } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(
                    `/api/${employee.id}/packages`,
                    {
                        params: { offset: state.offset, limit: state.limit },
                    },
                );
                setState((prevState) => ({
                    ...prevState,
                    companiesPackages: data.packages,
                    totalRows: data.totalRows,
                    isLoadingMore: false,
                    offset: prevState.offset + prevState.limit,
                }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoadingMore: false, errorMessage: data.message }));
            }
        },
        [state.limit, state.offset],
    );

    return { ...state, fetch, fetchMore };
};
