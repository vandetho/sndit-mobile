import React from 'react';
import { Package } from '@interfaces';
import { usePackagesFetcher } from '@fetchers';
import { useCompany } from './CompanyContext';

export const PackageContext = React.createContext<{
    packages: Package[];
    companiesPackages: Package[];
    isLoading: boolean;
    package: Package;
    onSelect: (pkg: Package) => void;
}>({
    package: undefined,
    isLoading: false,
    packages: [],
    companiesPackages: [],
    onSelect: (pkg: Package) => {
        console.log({ name: 'onSelect', pkg });
    },
});

export const PackageProvider: React.FunctionComponent = ({ children }) => {
    const { company } = useCompany();
    const [state, setState] = React.useState<{
        packages: Package[];
        companiesPackages: Package[];
        package: Package;
        isLoading: boolean;
    }>({
        isLoading: false,
        packages: [],
        package: undefined,
        companiesPackages: [],
    });
    const { packages, companiesPackages, isLoading } = usePackagesFetcher();

    React.useEffect(() => {
        setState((prevState) => ({ ...prevState, packages, isLoading }));
    }, [isLoading, packages]);

    React.useEffect(() => {
        setState((prevState) => ({ ...prevState, companiesPackages, isLoading }));
    }, [isLoading, companiesPackages]);

    const onSelect = React.useCallback((pkg: Package) => {
        setState((prevState) => ({ ...prevState, package: pkg }));
    }, []);

    return <PackageContext.Provider value={{ ...state, onSelect }}>{children}</PackageContext.Provider>;
};

export const usePackage = () => {
    return React.useContext(PackageContext);
};
