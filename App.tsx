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
import { View } from 'react-native';

enableScreens();

export default function App() {
    const [appIsReady, setAppIsReady] = React.useState(false);

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

    const onLayoutRootView = React.useCallback(async () => {
        if (appIsReady) {
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return <AppLoadingScreen />;
    }

    return (
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
            <BottomSheetModalProvider>
                <ApplicationProvider>
                    <UserProvider>
                        <CityProvider>
                            <MapProvider>
                                <AuthenticationProvider>
                                    <NotificationProvider>
                                        <CompanyProvider>
                                            <TemplateProvider>
                                                <EmployeeProvider>
                                                    <UserProvider>
                                                        <PackageProvider>
                                                            <ApplicationNavigator />
                                                            <Toast />
                                                        </PackageProvider>
                                                    </UserProvider>
                                                </EmployeeProvider>
                                            </TemplateProvider>
                                        </CompanyProvider>
                                    </NotificationProvider>
                                </AuthenticationProvider>
                            </MapProvider>
                        </CityProvider>
                    </UserProvider>
                </ApplicationProvider>
            </BottomSheetModalProvider>
        </View>
    );
}
