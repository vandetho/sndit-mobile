import React from 'react';
import { Company, ResponseSuccess, Template } from '@interfaces';
import { axios } from '@utils';

export const useTemplatesFetcher = () => {
    const [state, setState] = React.useState<{
        templates: Template[];
        totalRows: number;
        isLoading: boolean;
        isLoadingMore: boolean;
        errorMessage: string | undefined;
        offset: number;
        limit: number;
    }>({
        limit: 10,
        offset: 0,
        templates: [],
        totalRows: 0,
        isLoading: false,
        isLoadingMore: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(
        async (company: Company) => {
            setState((prevState) => ({ ...prevState, isLoading: true, errorMessage: undefined }));
            try {
                const {
                    data: { data },
                } = await axios.get<ResponseSuccess<{ templates: Template[]; totalRows: number }>>(`/api/templates`, {
                    params: {
                        company: company.id,
                        offset: 0,
                        limit: state.limit,
                    },
                });
                setState((prevState) => ({ ...prevState, ...data, offset: prevState.limit, isLoading: false }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
            }
        },
        [state.limit],
    );

    const fetchMore = React.useCallback(
        async (company: Company) => {
            if (state.offset < state.totalRows && !state.isLoadingMore) {
                setState((prevState) => ({ ...prevState, isLoadingMore: true, errorMessage: undefined }));
                try {
                    const {
                        data: { data },
                    } = await axios.get<ResponseSuccess<{ templates: Template[]; totalRows: number }>>(
                        `/api/templates`,
                        {
                            params: {
                                company: company.id,
                                offset: state.offset,
                                limit: state.limit,
                            },
                        },
                    );
                    setState((prevState) => ({
                        ...prevState,
                        templates: [...prevState.templates, ...data.templates],
                        totalRows: data.totalRows,
                        isLoadingMore: false,
                        offset: prevState.limit + prevState.offset,
                    }));
                } catch ({ response: { data } }) {
                    setState((prevState) => ({ ...prevState, isLoadingMore: false, errorMessage: data.message }));
                }
            }
        },
        [state.isLoadingMore, state.limit, state.offset, state.totalRows],
    );

    return { ...state, fetch, fetchMore };
};
