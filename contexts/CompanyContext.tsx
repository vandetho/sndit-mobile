import React from 'react';
import { Company } from '@interfaces';
import { useCompaniesFetcher } from '@fetchers';
import { useAuthentication } from './AuthenticationContext';
import { ROLES } from '@config';

export const CompanyContext = React.createContext<{
    companies: Company[];
    managerCompanies: Company[];
    company: Company;
    isLoading: boolean;
    onSelect: (company: Company) => void;
    onFetch: () => void;
}>({
    isLoading: false,
    managerCompanies: [],
    companies: [],
    company: undefined,
    onFetch: () => {
        console.log({ name: 'onFetch' });
    },
    onSelect: (company: Company) => {
        console.log({ name: 'onSelect', company });
    },
});

export const CompanyProvider: React.FunctionComponent = ({ children }) => {
    const { isLogged } = useAuthentication();
    const [state, setState] = React.useState<{
        companies: Company[];
        managerCompanies: Company[];
        isLoading: boolean;
        company: Company;
    }>({
        isLoading: false,
        companies: [],
        managerCompanies: [],
        company: undefined,
    });
    const { companies, isLoading, fetch } = useCompaniesFetcher();

    const onFetch = React.useCallback(async () => await fetch(), [fetch]);

    React.useEffect(() => {
        if (isLogged) {
            (async () => await onFetch())();
        }
    }, [isLogged, onFetch]);

    React.useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            companies,
            managerCompanies: companies.filter((company) => company.roles.includes(ROLES.MANAGER)),
            isLoading,
        }));
    }, [companies, isLoading]);

    const onSelect = React.useCallback((company: Company) => {
        setState((prevState) => ({ ...prevState, company }));
    }, []);

    return <CompanyContext.Provider value={{ ...state, onSelect, onFetch }}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => {
    return React.useContext(CompanyContext);
};
