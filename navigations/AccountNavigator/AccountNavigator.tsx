import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountScreen, PhoneNumberScreen, UserInformationScreen } from '@screens';

export type AccountStackParamsList = {
    Account: undefined;
    PhoneNumber: undefined;
    UserInformation: undefined;
};

const AccountStack = createStackNavigator<AccountStackParamsList>();

interface AccountNavigatorProps {}

const AccountNavigator = React.memo<AccountNavigatorProps>(() => (
    <AccountStack.Navigator screenOptions={{ headerShown: false }}>
        <AccountStack.Screen name="Account" component={AccountScreen} />
        <AccountStack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <AccountStack.Screen name="UserInformation" component={UserInformationScreen} />
    </AccountStack.Navigator>
));

export default AccountNavigator;
