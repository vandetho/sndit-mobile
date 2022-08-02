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

const LOCATION_TASK_NAME = 'background-location-task';

interface MapProviderProps {
    children?: React.ReactNode;
}

export const MapProvider: React.FunctionComponent<MapProviderProps> = ({ children }) => {
    const [state, setState] = React.useState<{
        region: Region | undefined;
        selectRegion: Region | undefined;
        isLoading: boolean;
    }>({
        selectRegion: undefined,
        isLoading: true,
        region: undefined,
    });

    /*
    const getLocationAsync = React.useCallback(async () => {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: LocationAccuracy.Highest,
            distanceInterval: 1,
            timeInterval: 5000,
        });

        return await Location.watchPositionAsync(
            {
                accuracy: LocationAccuracy.Highest,
                distanceInterval: 1,
                timeInterval: 10000,
            },
            (newLocation) => {
                const { coords } = newLocation;
                const region = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.045,
                    longitudeDelta: 0.045,
                };
                setState((prevState) => ({ ...prevState, region }));
            },
        );
    }, []);
    */

    React.useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            setState((prevState) => ({ ...prevState, isLoading: true }));
            // getLocationAsync();
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
