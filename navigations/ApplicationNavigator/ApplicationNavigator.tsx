import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { AuthLoadingScreen, LoginScreen, MapScreen } from '@screens';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BottomTabNavigator, BottomTabStackParamsList } from '@navigations/BottomTabNavigator';
import { SecureNavigator } from '@navigations/SecureNavigator';
import { darkTheme, lightTheme } from '@theme';
import { useAuthentication } from '@contexts';

export type ApplicationStackParamsList = {
    AuthLoading: undefined;
    BottomTabStack: NavigatorScreenParams<BottomTabStackParamsList>;
    SecureStacks: undefined;
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
                        <ApplicationStack.Screen name="SecureStacks" component={SecureNavigator} />
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
