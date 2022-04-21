import React from 'react';
import { Region } from 'react-native-maps';
import * as Location from 'expo-location';

export const MapContext = React.createContext<{
    isLoading: boolean;
    region: Region | undefined;
    selectRegion: Region | undefined;
    onSelectRegion: (region: Region) => void;
}>({
    isLoading: false,
    region: undefined,
    selectRegion: undefined,
    onSelectRegion: (region: Region) => {
        console.log({ region, name: 'onSelectRegion' });
    },
});

export const MapProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{
        region: Region | undefined;
        selectRegion: Region | undefined;
        isLoading: boolean;
    }>({
        selectRegion: undefined,
        isLoading: true,
        region: undefined,
    });

    React.useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            setState((prevState) => ({ ...prevState, isLoading: true }));
            const location = await Location.getCurrentPositionAsync({});
            setState((prevState) => ({
                ...prevState,
                isLoading: false,
                region: {
                    ...prevState.region,
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004,
                },
                selectRegion: {
                    ...prevState.region,
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004,
                },
            }));
        })();
    }, []);

    const onSelectRegion = React.useCallback((region: Region) => {
        setState((prevState) => ({ ...prevState, selectRegion: region }));
    }, []);

    return <MapContext.Provider value={{ ...state, onSelectRegion }}>{children}</MapContext.Provider>;
};

export const useMap = () => {
    return React.useContext(MapContext);
};
