import React from 'react';
import {
    Rubik_400Regular,
    Rubik_400Regular_Italic,
    Rubik_900Black,
    Rubik_900Black_Italic,
    useFonts,
} from '@expo-google-fonts/rubik';
import { enableScreens } from 'react-native-screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import {
    ApplicationProvider,
    AuthenticationProvider,
    CityProvider,
    CompanyProvider,
    EmployeeProvider,
    MapProvider,
    PackageProvider,
} from '@contexts';
import { AppLoadingScreen } from '@screens';
import { ApplicationNavigator } from '@navigations';
import './i18n';

enableScreens();

export default function App() {
    const [fontsLoaded] = useFonts({
        Rubik_400Regular,
        Rubik_400Regular_Italic,
        Rubik_900Black,
        Rubik_900Black_Italic,
    });

    if (!fontsLoaded) {
        return <AppLoadingScreen />;
    }
    return (
        <BottomSheetModalProvider>
            <ApplicationProvider>
                <CityProvider>
                    <MapProvider>
                        <AuthenticationProvider>
                            <CompanyProvider>
                                <EmployeeProvider>
                                    <PackageProvider>
                                        <ApplicationNavigator />
                                        <Toast />
                                    </PackageProvider>
                                </EmployeeProvider>
                            </CompanyProvider>
                        </AuthenticationProvider>
                    </MapProvider>
                </CityProvider>
            </ApplicationProvider>
        </BottomSheetModalProvider>
    );
}
