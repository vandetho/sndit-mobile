import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import {
    AuthLoadingScreen,
    CompanyQrCode,
    EmployeeQrCodeScreen,
    LoginScreen,
    MapScreen,
    NewCompanyScreen,
    NewPackageScreen,
    PackageQrCodeScreen,
    PackageScreen,
    PrinterScreen,
    UserQrCodeScreen,
    UserScreen,
} from '@screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BottomTabNavigator, BottomTabStackParamsList } from '@navigations/BottomTabNavigator';
import { darkTheme, lightTheme } from '@theme';
import { useAuthentication } from '@contexts';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { LinkingOptions } from '@react-navigation/native/lib/typescript/src/types';

export type ApplicationStackParamsList = {
    AuthLoading: undefined;
    BottomTabStack: NavigatorScreenParams<BottomTabStackParamsList>;
    UserQrCode: undefined;
    CompanyQrCode: undefined;
    EmployeeQrCode: undefined;
    Printer: undefined;
    PackageQrCode: undefined;
    Package: undefined;
    NewCompany: undefined;
    NewPackage: undefined;
    User: undefined;
    Login: undefined;
    Map: { draggable: boolean; latitude?: number; longitude?: number };
};

const prefix = Linking.createURL('/');

const linking: LinkingOptions<ApplicationStackParamsList> = {
    prefixes: [prefix],
    config: {
        screens: {
            Package: 'package',
        },
    },
    async getInitialURL() {
        let url = await Linking.getInitialURL();

        if (url != null) {
            return url;
        }

        const response = await Notifications.getLastNotificationResponseAsync();
        url = response?.notification.request.content.data.url as string;

        return url;
    },
    subscribe(listener) {
        const onReceiveURL = ({ url }: { url: string }) => listener(url);

        Linking.addEventListener('url', onReceiveURL);

        const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            const url = response.notification.request.content.data.url as string;
            listener(url);
        });

        return () => {
            subscription.remove();
        };
    },
};

const ApplicationStack = createStackNavigator<ApplicationStackParamsList>();

interface ApplicationNavigatorProps {}

const ApplicationNavigator = React.memo<ApplicationNavigatorProps>(() => {
    const scheme = useColorScheme();
    const { isLogged, isRefreshingToken } = useAuthentication();

    const renderScreens = React.useCallback(
        () =>
            isRefreshingToken ? (
                <ApplicationStack.Screen name="AuthLoading" component={AuthLoadingScreen} />
            ) : (
                <>
                    <ApplicationStack.Screen name="BottomTabStack" component={BottomTabNavigator} />
                    <ApplicationStack.Screen
                        name="Map"
                        component={MapScreen}
                        options={{
                            presentation: 'modal',
                            cardOverlayEnabled: true,
                            gestureEnabled: true,
                            ...TransitionPresets.ModalPresentationIOS,
                        }}
                    />
                    {isLogged ? (
                        <React.Fragment>
                            <ApplicationStack.Screen
                                name="User"
                                component={UserScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="UserQrCode"
                                component={UserQrCodeScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="CompanyQrCode"
                                component={CompanyQrCode}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="EmployeeQrCode"
                                component={EmployeeQrCodeScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="PackageQrCode"
                                component={PackageQrCodeScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="NewPackage"
                                component={NewPackageScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="NewCompany"
                                component={NewCompanyScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="Package"
                                component={PackageScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                            <ApplicationStack.Screen
                                name="Printer"
                                component={PrinterScreen}
                                options={{
                                    presentation: 'modal',
                                    gestureEnabled: true,
                                    cardOverlayEnabled: true,
                                    ...TransitionPresets.ModalPresentationIOS,
                                }}
                            />
                        </React.Fragment>
                    ) : (
                        <ApplicationStack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                presentation: 'modal',
                                cardOverlayEnabled: true,
                                gestureEnabled: true,
                                ...TransitionPresets.ModalPresentationIOS,
                            }}
                        />
                    )}
                </>
            ),
        [isLogged, isRefreshingToken],
    );

    return (
        <NavigationContainer linking={linking} theme={scheme === 'dark' ? darkTheme : lightTheme}>
            <BottomSheetModalProvider>
                <ApplicationStack.Navigator screenOptions={{ headerShown: false }}>
                    {renderScreens()}
                </ApplicationStack.Navigator>
            </BottomSheetModalProvider>
        </NavigationContainer>
    );
});

export default ApplicationNavigator;
