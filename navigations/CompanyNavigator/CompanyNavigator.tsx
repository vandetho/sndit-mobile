import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CompaniesScreen, CompanyScreen } from '@screens';

export type CompanyStackParamList = {
    Companies: undefined;
    Company: undefined;
    NewCompany: undefined;
};

const CompanyStack = createStackNavigator<CompanyStackParamList>();

interface CompanyNavigatorProps {}

const CompanyNavigator = React.memo<CompanyNavigatorProps>(() => {
    return (
        <CompanyStack.Navigator screenOptions={{ headerShown: false }}>
            <CompanyStack.Screen name="Companies" component={CompaniesScreen} />
            <CompanyStack.Screen name="Company" component={CompanyScreen} />
        </CompanyStack.Navigator>
    );
});

export default CompanyNavigator;
