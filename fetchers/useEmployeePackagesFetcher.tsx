import React from 'react';
import { Employee, Package, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useEmployeePackagesFetcher = () => {
    const [state, setState] = React.useState<{
        packages: Package[];
        totalRows: number;
        isLoading: boolean;
        isLoadingMore: boolean;
        errorMessage: string | undefined;
        offset: number;
        limit: number;
    }>({
        packages: [],
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
                    packages: data.packages,
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
            if (state.offset < state.totalRows) {
                setState((prevState) => ({ ...prevState, isLoadingMore: true, errorMessage: undefined }));
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
                        packages: [...prevState.packages, ...data.packages],
                        totalRows: data.totalRows,
                        isLoadingMore: false,
                        offset: prevState.offset + prevState.limit,
                    }));
                } catch ({ response: { data } }) {
                    setState((prevState) => ({ ...prevState, isLoadingMore: false, errorMessage: data.message }));
                }
            }
        },
        [state.limit, state.offset, state.totalRows],
    );

    return { ...state, fetch, fetchMore };
};
