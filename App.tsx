import React from 'react';
import {
    Rubik_400Regular,
    Rubik_400Regular_Italic,
    Rubik_900Black,
    Rubik_900Black_Italic,
} from '@expo-google-fonts/rubik';
import { enableScreens } from 'react-native-screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as Sentry from 'sentry-expo';
import {
    ApplicationProvider,
    AuthenticationProvider,
    CityProvider,
    CompanyProvider,
    EmployeeProvider,
    MapProvider,
    NotificationProvider,
    PackageProvider,
    TemplateProvider,
    UserProvider,
} from '@contexts';
import { AppLoadingScreen } from '@screens';
import { ApplicationNavigator } from '@navigations';
import Constants from 'expo-constants';
import './i18n';

enableScreens();

// Sentry.init({
//     dsn: Constants.manifest.extra.dsn,
//     enableInExpoDevelopment: Constants.manifest.extra.beta === 'true',
//     debug: Constants.manifest.extra.beta === 'true',
// });

export default function App() {
    const [appIsReady, setAppIsReady] = React.useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = React.useState(false);

    React.useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({
                    Rubik_400Regular,
                    Rubik_400Regular_Italic,
                    Rubik_900Black,
                    Rubik_900Black_Italic,
                });
                await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }
        (async () => await prepare())();
    }, [appIsReady]);

    if (!appIsReady || !isSplashAnimationComplete) {
        return <AppLoadingScreen onComplete={setAnimationComplete} />;
    }

    return (
        <BottomSheetModalProvider>
            <ApplicationProvider>
                <UserProvider>
                    <CityProvider>
                        <MapProvider>
                            <AuthenticationProvider>
                                <CompanyProvider>
                                    <TemplateProvider>
                                        <EmployeeProvider>
                                            <UserProvider>
                                                <PackageProvider>
                                                    <NotificationProvider>
                                                        <ApplicationNavigator />
                                                        <Toast />
                                                    </NotificationProvider>
                                                </PackageProvider>
                                            </UserProvider>
                                        </EmployeeProvider>
                                    </TemplateProvider>
                                </CompanyProvider>
                            </AuthenticationProvider>
                        </MapProvider>
                    </CityProvider>
                </UserProvider>
            </ApplicationProvider>
        </BottomSheetModalProvider>
    );
}
