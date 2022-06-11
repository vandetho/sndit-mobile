import React from 'react';
import { Notification, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useNotificationsFetcher = () => {
    const [state, setState] = React.useState<{
        notifications: Notification[];
        totalRows: number;
        isLoading: boolean;
        isLoadingMore: boolean;
        errorMessage: string | undefined;
        offset: number;
        limit: number;
    }>({
        limit: 10,
        offset: 0,
        notifications: [],
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
            } = await axios.get<ResponseSuccess<{ notifications: Notification[]; totalRows: number }>>(
                `/api/notifications`,
                {
                    params: {
                        offset: 0,
                        limit: state.limit,
                    },
                },
            );
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
                } = await axios.get<ResponseSuccess<{ notifications: Notification[]; totalRows: number }>>(
                    `/api/notifications`,
                    {
                        params: {
                            offset: state.offset,
                            limit: state.limit,
                        },
                    },
                );
                setState((prevState) => ({
                    ...prevState,
                    notifications: [...prevState.notifications, ...data.notifications],
                    totalRows: data.totalRows,
                    isLoadingMore: false,
                    offset: prevState.limit + prevState.offset,
                }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoadingMore: false, errorMessage: data.message }));
            }
        }
    }, [state.isLoadingMore, state.limit, state.offset, state.totalRows]);

    const addNotification = React.useCallback((pkg: Notification) => {
        setState((prevState) => ({ ...prevState, notifications: [...prevState.notifications, pkg] }));
    }, []);

    return { ...state, fetch, fetchMore, addNotification };
};
