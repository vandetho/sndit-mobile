import React from 'react';
import { Company, Employee, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useEmployeesFetcher = () => {
    const [state, setState] = React.useState<{
        employees: Employee[];
        totalRows: number;
        offset: number;
        limit: number;
        isLoading: boolean;
        isLoadingMore: boolean;
        errorMessage: string | undefined;
    }>({
        limit: 10,
        offset: 0,
        employees: [],
        totalRows: 0,
        isLoading: false,
        isLoadingMore: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(
        async (company: Company) => {
            if (company) {
                setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: undefined }));
                try {
                    const {
                        data: { data },
                    } = await axios.get<ResponseSuccess<{ employees: Employee[]; totalRows: number }>>(
                        `/api/companies/${company.id}/employees`,
                        {
                            params: {
                                offset: 0,
                                limit: state.limit,
                            },
                        },
                    );
                    setState((prevState) => ({ ...prevState, ...data, isLoading: false, offset: prevState.limit }));
                } catch ({ response: { data } }) {
                    setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
                }
            }
        },
        [state.limit],
    );

    const fetchMore = React.useCallback(
        async (company: Company) => {
            if (company && state.offset < state.totalRows) {
                setState((prevState) => ({ ...prevState, isLoadingMore: true, errorMessage: undefined }));
                try {
                    const {
                        data: { data },
                    } = await axios.get<ResponseSuccess<{ employees: Employee[]; totalRows: number }>>(
                        `/api/${company.id}/employees`,
                        {
                            params: {
                                offset: state.offset,
                                limit: state.limit,
                            },
                        },
                    );
                    setState((prevState) => ({
                        ...prevState,
                        employees: [...prevState.employees, ...data.employees],
                        totalRows: data.totalRows,
                        offset: prevState.offset + prevState.limit,
                        isLoadingMore: false,
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
