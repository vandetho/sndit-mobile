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
import { Platform, View } from 'react-native';
import * as Linking from 'expo-linking';
import './i18n';
import { ParsedURL } from 'expo-linking/src/Linking.types';

enableScreens();

export default function App() {
    const [appIsReady, setAppIsReady] = React.useState(false);
    const [data, setData] = React.useState<ParsedURL>();

    const handleDeepLink = React.useCallback((event: Linking.EventType) => {
        const data = Linking.parse(event.url);
        console.log({ data });
        setData(data);
    }, []);

    React.useEffect(() => {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then((url) => {
                this.navigate(url);
            });
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }
        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, [handleDeepLink]);

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
