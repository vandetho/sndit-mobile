import React from 'react';
import { NavigatorScreenParams } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { SettingNavigator, SettingStackParamsList } from '@navigations/SettingNavigator';
import { PackageNavigator, PackageStackParamList } from '@navigations/PackageNavigator';
import { CompanyNavigator, CompanyStackParamList } from '@navigations/CompanyNavigator';
import { DashboardScreen } from '@screens';
import { BottomTabBar } from './components';

export type BottomTabStackParamsList = {
    Home: { eventToken?: string };
    QrCodeScanner: undefined;
    PackageStack: NavigatorScreenParams<PackageStackParamList>;
    CompanyStack: NavigatorScreenParams<CompanyStackParamList>;
    SettingStack: NavigatorScreenParams<SettingStackParamsList>;
};

const BottomTabStack = createBottomTabNavigator<BottomTabStackParamsList>();

interface BottomTabNavigatorProps {}

const BottomTabNavigatorComponent: React.FunctionComponent<BottomTabNavigatorProps> = () => {
    const { t } = useTranslation();
    return (
        <BottomTabStack.Navigator
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{ headerShown: false, tabBarShowLabel: false }}
        >
            <BottomTabStack.Screen
                name="Home"
                component={DashboardScreen}
                options={{
                    tabBarLabel: t('home'),
                }}
            />
            <BottomTabStack.Screen
                name="PackageStack"
                component={PackageNavigator}
                options={{
                    tabBarLabel: t('packages'),
                }}
            />
            <BottomTabStack.Screen
                name="QrCodeScanner"
                component={PackageNavigator}
                options={{
                    tabBarLabel: t('packages'),
                }}
            />
            <BottomTabStack.Screen
                name="CompanyStack"
                component={CompanyNavigator}
                options={{
                    tabBarLabel: t('companies'),
                }}
            />
            <BottomTabStack.Screen
                name="SettingStack"
                component={SettingNavigator}
                options={{
                    tabBarLabel: t('setting'),
                }}
            />
        </BottomTabStack.Navigator>
    );
};

const BottomTabNavigator = React.memo(BottomTabNavigatorComponent);

export default BottomTabNavigator;
