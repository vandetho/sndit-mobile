import React from 'react';
import { Employee } from '@interfaces';
import { useEmployeesFetcher } from '@fetchers';
import { useCompany } from './CompanyContext';

export const EmployeeContext = React.createContext<{
    employees: Employee[];
    employee: Employee;
    isLoading: boolean;
    onSelect: (employee: Employee) => void;
}>({
    isLoading: false,
    employees: [],
    employee: undefined,
    onSelect: (employee: Employee) => {
        console.log({ name: 'onSelect', employee });
    },
});

export const EmployeeProvider: React.FunctionComponent = ({ children }) => {
    const { company } = useCompany();
    const [state, setState] = React.useState<{
        employee: Employee;
    }>({
        employee: undefined,
    });
    const { employees, fetch, isLoading } = useEmployeesFetcher();

    React.useEffect(() => {
        if (company) {
            (async () => fetch(company))();
        }
    }, [company, fetch]);

    const onSelect = React.useCallback((employee: Employee) => {
        setState((prevState) => ({ ...prevState, employee }));
    }, []);

    return (
        <EmployeeContext.Provider value={{ ...state, employees, isLoading, onSelect }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => {
    return React.useContext(EmployeeContext);
};
