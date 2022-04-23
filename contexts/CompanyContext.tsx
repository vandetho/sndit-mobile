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
}>({
    isLoading: false,
    managerCompanies: [],
    companies: [],
    company: undefined,
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

    React.useEffect(() => {
        if (isLogged) {
            (async () => await fetch())();
        }
    }, [fetch, isLogged]);

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

    return <CompanyContext.Provider value={{ ...state, onSelect }}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => {
    return React.useContext(CompanyContext);
};
