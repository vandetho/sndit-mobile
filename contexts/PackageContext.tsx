import React from 'react';
import { Package } from '@interfaces';
import { usePackageFetcher, usePackagesFetcher } from '@fetchers';
import { useAuthentication } from './AuthenticationContext';

export const PackageContext = React.createContext<{
    packages: Package[];
    isLoading: boolean;
    isLoadingMore: boolean;
    item: Package;
    onSelect: (pkg: Package) => void;
    onAddPackage: (pkg: Package) => void;
    onRefreshSelect: () => void;
    fetchPackages: () => void;
    fetchMorePackages: () => void;
}>({
    item: undefined,
    isLoading: false,
    isLoadingMore: false,
    packages: [],
    onSelect: (pkg: Package) => {
        console.log({ name: 'onSelect', pkg });
    },
    onAddPackage: (pkg: Package) => {
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

interface PackageProviderProps {
    children?: React.ReactNode;
}

export const PackageProvider: React.FunctionComponent<PackageProviderProps> = ({ children }) => {
    const { isLogged } = useAuthentication();
    const [state, setState] = React.useState<{
        item: Package;
    }>({
        item: undefined,
    });
    const {
        addPackage,
        packages,
        fetch: fetchPackages,
        isLoading,
        fetchMore: fetchMorePackages,
        isLoadingMore,
    } = usePackagesFetcher();
    const { item, fetch: fetchPackage } = usePackageFetcher();

    React.useEffect(() => {
        if (isLogged) {
            (async () => await fetchPackages())();
        }
    }, [fetchPackages, isLogged]);

    React.useEffect(() => {
        if (item) {
            setState((prevState) => ({ ...prevState, item }));
        }
    }, [item]);

    const onSelect = React.useCallback((pkg: Package) => {
        setState((prevState) => ({ ...prevState, item: pkg }));
    }, []);

    const onAddPackage = React.useCallback(
        (pkg: Package) => {
            addPackage(pkg);
        },
        [addPackage],
    );

    const onRefreshSelect = React.useCallback(async () => {
        if (state.item) {
            await fetchPackage(state.item.token);
        }
    }, [fetchPackage, state.item]);

    return (
        <PackageContext.Provider
            value={{
                ...state,
                onAddPackage,
                packages,
                isLoading,
                isLoadingMore,
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
