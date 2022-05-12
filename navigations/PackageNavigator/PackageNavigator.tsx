import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PackagesScreen } from '@screens';

export type PackageStackParamList = {
    Packages: undefined;
};

const PackageStack = createStackNavigator<PackageStackParamList>();

interface PackageNavigatorProps {}

const PackageNavigator = React.memo<PackageNavigatorProps>(() => {
    return (
        <PackageStack.Navigator screenOptions={{ headerShown: false }}>
            <PackageStack.Screen name="Packages" component={PackagesScreen} />
        </PackageStack.Navigator>
    );
});

export default PackageNavigator;
