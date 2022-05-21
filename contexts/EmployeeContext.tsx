import React from 'react';
import { Employee } from '@interfaces';
import { useEmployeesFetcher } from '@fetchers';
import { useCompany } from './CompanyContext';

export const EmployeeContext = React.createContext<{
    employees: Employee[];
    employee: Employee;
    isLoading: boolean;
    onSelect: (employee: Employee) => void;
    onUpdate: (employee: Employee, index: number) => void;
}>({
    isLoading: false,
    employees: [],
    employee: undefined,
    onSelect: (employee: Employee) => {
        console.log({ name: 'onSelect', employee });
    },
    onUpdate: (employee: Employee, index: number) => {
        console.log({ name: 'onUpdate', employee, index });
    },
});

export const EmployeeProvider: React.FunctionComponent = ({ children }) => {
    const { company } = useCompany();
    const [state, setState] = React.useState<{
        employee: Employee;
        employees: Employee[];
    }>({
        employee: undefined,
        employees: [],
    });
    const { employees, fetch, isLoading } = useEmployeesFetcher();

    React.useEffect(() => {
        if (company) {
            (async () => fetch(company))();
        }
    }, [company, fetch]);

    React.useEffect(() => {
        if (employees) {
            setState((prevState) => ({ ...prevState, employees }));
        }
    }, [company, employees, fetch]);

    const onUpdate = React.useCallback(
        (employee: Employee, index: number) => {
            const employees = [...state.employees];
            employees[index] = employee;
            setState((prevState) => ({ ...prevState, employees }));
        },
        [state.employees],
    );

    const onSelect = React.useCallback((employee: Employee) => {
        setState((prevState) => ({ ...prevState, employee }));
    }, []);

    return (
        <EmployeeContext.Provider value={{ ...state, isLoading, onSelect, onUpdate }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => {
    return React.useContext(EmployeeContext);
};
