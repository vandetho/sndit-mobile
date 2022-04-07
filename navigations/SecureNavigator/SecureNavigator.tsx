import React from 'react';
import { TransitionPresets } from '@react-navigation/stack';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import {
    EmployeeQrCodeScreen,
    NewCompanyScreen,
    NewPackageScreen,
    PackageQrCodeScreen,
    UserQrCodeScreen,
} from '@screens';

export type SecureStackParamList = {
    UserQrCode: undefined;
    EmployeeQrCode: undefined;
    PackageQrCode: undefined;
    NewCompany: undefined;
    NewPackage: undefined;
};

const SecureStack = createSharedElementStackNavigator<SecureStackParamList>();

interface SecureNavigatorProps {}

const SecureNavigator = React.memo<SecureNavigatorProps>(() => {
    return (
        <SecureStack.Navigator screenOptions={{ headerShown: false }}>
            <SecureStack.Screen
                name="UserQrCode"
                component={UserQrCodeScreen}
                options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
            />
            <SecureStack.Screen
                name="EmployeeQrCode"
                component={EmployeeQrCodeScreen}
                options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
            />
            <SecureStack.Screen
                name="PackageQrCode"
                component={PackageQrCodeScreen}
                options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
            />
            <SecureStack.Screen
                name="NewPackage"
                component={NewPackageScreen}
                options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
            />
        </SecureStack.Navigator>
    );
});

export default SecureNavigator;
