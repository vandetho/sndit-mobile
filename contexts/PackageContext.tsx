import React from 'react';
import { Package } from '@interfaces';
import { useCompanyPackagesFetcher, usePackageFetcher, usePackagesFetcher } from '@fetchers';
import { useCompany } from './CompanyContext';

export const PackageContext = React.createContext<{
    packages: Package[];
    companiesPackages: Package[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isLoadingCompany: boolean;
    item: Package;
    onSelect: (pkg: Package) => void;
    onRefreshSelect: () => void;
    fetchPackages: () => void;
    fetchMorePackages: () => void;
}>({
    item: undefined,
    isLoading: false,
    isLoadingMore: false,
    isLoadingCompany: false,
    packages: [],
    companiesPackages: [],
    onSelect: (pkg: Package) => {
        console.log({ name: 'onSelect', pkg });
    },
    onRefreshSelect: () => {
        console.log({ name: 'onRefreshSelect' });
    },
    fetchPackages: () => {
        console.log({ name: 'fetchPackages' });
    },
    fetchMorePackages: () => {
        console.log({ name: 'fetchMorePackages' });
    },
});

export const PackageProvider: React.FunctionComponent = ({ children }) => {
    const { company } = useCompany();
    const [state, setState] = React.useState<{
        item: Package;
    }>({
        item: undefined,
    });
    const {
        packages,
        fetch: fetchPackages,
        isLoading,
        fetchMore: fetchMorePackages,
        isLoadingMore,
    } = usePackagesFetcher();
    const { item, fetch: fetchPackage } = usePackageFetcher();

    const {
        packages: companiesPackages,
        fetch: fetchCompany,
        isLoading: isLoadingCompany,
    } = useCompanyPackagesFetcher();

    React.useEffect(() => {
        (async () => await fetchPackages())();
    }, [fetchPackages]);

    React.useEffect(() => {
        if (item) {
            setState((prevState) => ({ ...prevState, item }));
        }
    }, [item]);

    React.useEffect(() => {
        if (company) {
            (async () => await fetchCompany(company))();
        }
    }, [company, fetchCompany]);

    const onSelect = React.useCallback((pkg: Package) => {
        setState((prevState) => ({ ...prevState, item: pkg }));
    }, []);

    const onRefreshSelect = React.useCallback(async () => {
        if (state.item) {
            await fetchPackage(state.item.token);
        }
    }, [fetchPackage, state.item]);

    return (
        <PackageContext.Provider
            value={{
                ...state,
                companiesPackages,
                packages,
                isLoading,
                isLoadingMore,
                isLoadingCompany,
                onSelect,
                onRefreshSelect,
                fetchPackages,
                fetchMorePackages,
            }}
        >
            {children}
        </PackageContext.Provider>
    );
};

export const usePackage = () => {
    return React.useContext(PackageContext);
};
