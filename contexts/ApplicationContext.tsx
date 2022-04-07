import React from 'react';
import { DeviceType, getDeviceTypeAsync } from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const ApplicationContext = React.createContext({
    isTablet: false,
    isBeta: true,
    isAndroid: false,
});

export const ApplicationProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState({
        isTablet: false,
        isBeta: Constants.manifest.extra.beta === 'true',
        isAndroid: Platform.OS === 'android',
    });

    React.useEffect(() => {
        getDeviceTypeAsync().then((deviceType) => {
            setState((prevState) => ({
                ...prevState,
                isTablet: deviceType === DeviceType.TABLET,
            }));
        });
    }, []);

    return <ApplicationContext.Provider value={{ ...state }}>{children}</ApplicationContext.Provider>;
};

export const useApplication = () => {
    return React.useContext(ApplicationContext);
};
