import React from 'react';
import { Package } from '@interfaces';
import { usePackagesFetcher } from '@fetchers';

export const PackageContext = React.createContext<{
    packages: Package[];
    companiesPackages: Package[];
    isLoading: boolean;
    item: Package;
    onSelect: (pkg: Package) => void;
}>({
    item: undefined,
    isLoading: false,
    packages: [],
    companiesPackages: [],
    onSelect: (pkg: Package) => {
        console.log({ name: 'onSelect', pkg });
    },
});

export const PackageProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{
        packages: Package[];
        companiesPackages: Package[];
        item: Package;
        isLoading: boolean;
    }>({
        isLoading: false,
        packages: [],
        item: undefined,
        companiesPackages: [],
    });
    const { packages, companiesPackages, fetch, isLoading } = usePackagesFetcher();

    React.useEffect(() => {
        (async () => await fetch())();
    }, [fetch]);

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
