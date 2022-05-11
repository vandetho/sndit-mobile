import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingScreen } from '@screens';
import { NavigatorScreenParams } from '@react-navigation/native';
import { AccountNavigator, AccountStackParamsList } from '@navigations/AccountNavigator';

export type SettingStackParamsList = {
    Setting: undefined;
    AccountStack: NavigatorScreenParams<AccountStackParamsList>;
};

const SettingStack = createStackNavigator<SettingStackParamsList>();

interface SettingNavigatorProps {}

const SettingNavigator: React.FunctionComponent<SettingNavigatorProps> = () => {
    return (
        <SettingStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingStack.Screen name="Setting" component={SettingScreen} />
            <SettingStack.Screen name="AccountStack" component={AccountNavigator} />
        </SettingStack.Navigator>
    );
};

export default SettingNavigator;
