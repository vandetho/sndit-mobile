import React from 'react';
import { Company, Employee, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const useEmployeesFetcher = (company: Company) => {
    const [state, setState] = React.useState<{
        employees: Employee[];
        totalRows: number;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        employees: [],
        totalRows: 0,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async (company: Company) => {
        if (company) {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            try {
                const {
                    data: { data },
                } = await axios.get<ResponseSuccess<{ employees: Employee[]; totalRows: number }>>(
                    `/api/${company.id}/employees`,
                );
                setState((prevState) => ({ ...prevState, ...data, isLoading: false }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
            }
        }
    }, []);

    React.useEffect(() => {
        (async () => fetch(company))();
    }, [company, fetch]);

    return { ...state, fetch };
};
