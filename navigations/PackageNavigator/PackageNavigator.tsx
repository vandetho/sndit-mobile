import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PackageScreen, PackagesScreen } from '@screens';

export type PackageStackParamList = {
    Packages: undefined;
    Package: undefined;
};

const PackageStack = createStackNavigator<PackageStackParamList>();

interface PackageNavigatorProps {}

const PackageNavigator = React.memo<PackageNavigatorProps>(() => {
    return (
        <PackageStack.Navigator screenOptions={{ headerShown: false }}>
            <PackageStack.Screen name="Packages" component={PackagesScreen} />
            <PackageStack.Screen name="Package" component={PackageScreen} />
        </PackageStack.Navigator>
    );
});

export default PackageNavigator;
