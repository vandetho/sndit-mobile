import React from 'react';
import { Company, Employee, Package, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const usePackagesFetcher = () => {
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
        limit: 10,
        offset: 0,
        packages: [],
        companiesPackages: [],
        totalRows: 0,
        isLoading: false,
        isLoadingMore: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(`/api/packages`, {
                params: {
                    offset: 0,
                    limit: state.limit,
                },
            });
            setState((prevState) => ({ ...prevState, ...data, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, [state.limit]);

    const fetchMore = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, isLoadingMore: true }));
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
                ...data,
                isLoadingMore: false,
                offset: prevState.limit + prevState.offset,
            }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, [state.limit, state.offset]);

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

    const fetchEmployee = React.useCallback(async (employee: Employee) => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<{ packages: Package[]; totalRows: number }>>(
                `/api/${employee.id}/packages`,
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

    return { ...state, fetch, fetchMore, fetchCompany, fetchEmployee };
};
