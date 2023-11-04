import React from 'react';
import {
    Rubik_400Regular,
    Rubik_400Regular_Italic,
    Rubik_900Black,
    Rubik_900Black_Italic,
} from '@expo-google-fonts/rubik';
import { enableScreens } from 'react-native-screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
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
import './i18n';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import { store } from '@stores';

enableScreens();

export default function App() {
    const [appIsReady, setAppIsReady] = React.useState(false);
    const [isSplashAnimationComplete, setAnimationComplete] = React.useState(false);

    React.useEffect(() => {
        async function prepare() {
            try {
                await SplashScreen.hideAsync();
                await Font.loadAsync({
                    Rubik_400Regular,
                    Rubik_400Regular_Italic,
                    Rubik_900Black,
                    Rubik_900Black_Italic,
                });
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
            <Provider store={store}>
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
                                                        <FlashMessage position="top" />
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
            </Provider>
        </BottomSheetModalProvider>
    );
}
