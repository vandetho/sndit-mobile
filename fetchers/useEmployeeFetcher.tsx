import React from 'react';
import { Employee, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useEmployeeFetcher = () => {
    const [state, setState] = React.useState<{
        employee: Employee;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        employee: undefined,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async (idOrToken: string | number) => {
        setState((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const {
                data: { data },
            } = await axios.get<ResponseSuccess<Employee>>(`/api/employees/${idOrToken}`);
            setState((prevState) => ({ ...prevState, employee: data, isLoading: false }));
        } catch ({ response: { data } }) {
            setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
        }
    }, []);

    return { ...state, fetch };
};
