import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingScreen } from '@screens';
import { useTranslation } from 'react-i18next';

export type SettingStackParamsList = {
    Setting: undefined;
};

const SettingStack = createStackNavigator<SettingStackParamsList>();

interface SettingNavigatorProps {}

const SettingNavigator: React.FunctionComponent<SettingNavigatorProps> = () => {
    const { t } = useTranslation();
    return (
        <SettingStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingStack.Screen name="Setting" component={SettingScreen} />
        </SettingStack.Navigator>
    );
};

export default SettingNavigator;
