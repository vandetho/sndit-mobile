import React from 'react';
import { Package, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const usePackagesFetcher = () => {
    const [state, setState] = React.useState<{
        packages: Package[];
        totalRows: number;
        isLoading: boolean;
        isLoadingMore: boolean;
        errorMessage: string | undefined;
        offset: number;
        limit: number;
    }>({
        limit: 10,
        offset: 0,
        packages: [],
        totalRows: 0,
        isLoading: false,
        isLoadingMore: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: undefined }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(`/api/packages`, {
                params: {
                    offset: 0,
                    limit: state.limit,
                },
            });
            setState((prevState) => ({ ...prevState, ...data, offset: prevState.limit, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, [state.limit]);

    const fetchMore = React.useCallback(async () => {
        if (state.offset < state.totalRows && !state.isLoadingMore) {
            setState((prevState) => ({ ...prevState, isLoadingMore: true, errorMessage: undefined }));
            try {
                const {
                    data: { data },
                } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(`/api/packages`, {
                    params: {
                        offset: state.offset,
                        limit: state.limit,
                    },
                });
                setState((prevState) => ({
                    ...prevState,
                    packages: [...prevState.packages, ...data.packages],
                    totalRows: data.totalRows,
                    isLoadingMore: false,
                    offset: prevState.limit + prevState.offset,
                }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoadingMore: false, errorMessage: data.message }));
            }
        }
    }, [state.isLoadingMore, state.limit, state.offset, state.totalRows]);

    const addPackage = React.useCallback((pkg: Package) => {
        setState((prevState) => ({ ...prevState, packages: [...prevState.packages, pkg] }));
    }, []);

    return { ...state, fetch, fetchMore, addPackage };
};
