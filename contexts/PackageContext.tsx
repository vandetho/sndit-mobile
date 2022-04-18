import React from 'react';
import { Package } from '@interfaces';
import { useCompanyPackagesFetcher, usePackagesFetcher } from '@fetchers';
import { useCompany } from './CompanyContext';

export const PackageContext = React.createContext<{
    packages: Package[];
    companiesPackages: Package[];
    isLoading: boolean;
    isLoadingCompany: boolean;
    item: Package;
    onSelect: (pkg: Package) => void;
}>({
    item: undefined,
    isLoading: false,
    isLoadingCompany: false,
    packages: [],
    companiesPackages: [],
    onSelect: (pkg: Package) => {
        console.log({ name: 'onSelect', pkg });
    },
});

export const PackageProvider: React.FunctionComponent = ({ children }) => {
    const { company } = useCompany();
    const [state, setState] = React.useState<{
        item: Package;
    }>({
        item: undefined,
    });
    const { packages, fetch, isLoading } = usePackagesFetcher();
    const {
        packages: companiesPackages,
        fetch: fetchCompany,
        isLoading: isLoadingCompany,
    } = useCompanyPackagesFetcher();

    React.useEffect(() => {
        (async () => await fetch())();
    }, [fetch]);

    React.useEffect(() => {
        if (company) {
            (async () => await fetchCompany(company))();
        }
    }, [company, fetchCompany]);

    const onSelect = React.useCallback((pkg: Package) => {
        setState((prevState) => ({ ...prevState, item: pkg }));
    }, []);

    return (
        <PackageContext.Provider
            value={{
                ...state,
                companiesPackages,
                packages,
                isLoading,
                isLoadingCompany,
                onSelect,
            }}
        >
            {children}
        </PackageContext.Provider>
    );
};

export const usePackage = () => {
    return React.useContext(PackageContext);
};
