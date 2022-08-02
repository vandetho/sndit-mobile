import React from 'react';
import { City } from '@interfaces';
import { useCitiesFetcher } from '@fetchers';

export const CityContext = React.createContext<{
    cities: City[];
    isLoading: boolean;
}>({
    isLoading: false,
    cities: [],
});

interface CityProviderProps {
    children?: React.ReactNode;
}

export const CityProvider: React.FunctionComponent<CityProviderProps> = ({ children }) => {
    const [state, setState] = React.useState<{
        cities: City[];
        isLoading: boolean;
    }>({
        isLoading: false,
        cities: [],
    });
    const { cities, isLoading } = useCitiesFetcher();

    React.useEffect(() => {
        setState((prevState) => ({ ...prevState, cities, isLoading }));
    }, [cities, isLoading]);

    return <CityContext.Provider value={{ ...state }}>{children}</CityContext.Provider>;
};

export const useCity = () => {
    return React.useContext(CityContext);
};
