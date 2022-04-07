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
        employees: Employee[];
        employee: Employee;
        isLoading: boolean;
    }>({
        isLoading: false,
        employees: [],
        employee: undefined,
    });
    const { employees, isLoading } = useEmployeesFetcher(company);

    React.useEffect(() => {
        setState((prevState) => ({ ...prevState, employees, isLoading }));
    }, [employees, isLoading]);

    const onSelect = React.useCallback((employee: Employee) => {
        setState((prevState) => ({ ...prevState, employee }));
    }, []);

    return <EmployeeContext.Provider value={{ ...state, onSelect }}>{children}</EmployeeContext.Provider>;
};

export const useEmployee = () => {
    return React.useContext(EmployeeContext);
};
