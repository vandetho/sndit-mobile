import React from 'react';
import { Company } from '@interfaces';
import { useCompaniesFetcher } from '@fetchers';

export const CompanyContext = React.createContext<{
    companies: Company[];
    company: Company;
    isLoading: boolean;
    onSelect: (company: Company) => void;
}>({
    isLoading: false,
    companies: [],
    company: undefined,
    onSelect: (company: Company) => {
        console.log({ name: 'onSelect', company });
    },
});

export const CompanyProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{
        companies: Company[];
        isLoading: boolean;
        company: Company;
    }>({
        isLoading: false,
        companies: [],
        company: undefined,
    });
    const { companies, isLoading } = useCompaniesFetcher();

    React.useEffect(() => {
        setState((prevState) => ({ ...prevState, companies, isLoading }));
    }, [companies, isLoading]);

    const onSelect = React.useCallback((company: Company) => {
        setState((prevState) => ({ ...prevState, company }));
    }, []);

    return <CompanyContext.Provider value={{ ...state, onSelect }}>{children}</CompanyContext.Provider>;
};

export const useCompany = () => {
    return React.useContext(CompanyContext);
};
