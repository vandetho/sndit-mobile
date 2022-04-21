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
    PrinterScreen,
    UserQrCodeScreen,
} from '@screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BottomTabNavigator, BottomTabStackParamsList } from '@navigations/BottomTabNavigator';
import { darkTheme, lightTheme } from '@theme';
import { useAuthentication } from '@contexts';

export type ApplicationStackParamsList = {
    AuthLoading: undefined;
    BottomTabStack: NavigatorScreenParams<BottomTabStackParamsList>;
    UserQrCode: undefined;
    CompanyQrCode: undefined;
    EmployeeQrCode: undefined;
    Printer: undefined;
    PackageQrCode: undefined;
    NewCompany: undefined;
    NewPackage: undefined;
    User: undefined;
    Login: undefined;
    Map: { draggable: boolean; latitude?: number; longitude?: number };
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
        <NavigationContainer theme={scheme === 'dark' ? darkTheme : lightTheme}>
            <BottomSheetModalProvider>
                <ApplicationStack.Navigator screenOptions={{ headerShown: false }}>
                    {renderScreens()}
                </ApplicationStack.Navigator>
            </BottomSheetModalProvider>
        </NavigationContainer>
    );
});

export default ApplicationNavigator;
