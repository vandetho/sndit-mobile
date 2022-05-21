import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CompaniesScreen, CompanyScreen, EmployeeScreen, EmployeesScreen, TemplatesScreen } from '@screens';

export type CompanyStackParamList = {
    Companies: undefined;
    Company: undefined;
    Employees: undefined;
    Employee: undefined;
    Templates: undefined;
};

const CompanyStack = createStackNavigator<CompanyStackParamList>();

interface CompanyNavigatorProps {}

const CompanyNavigator = React.memo<CompanyNavigatorProps>(() => {
    return (
        <CompanyStack.Navigator screenOptions={{ headerShown: false }}>
            <CompanyStack.Screen name="Companies" component={CompaniesScreen} />
            <CompanyStack.Screen name="Company" component={CompanyScreen} />
            <CompanyStack.Screen name="Employees" component={EmployeesScreen} />
            <CompanyStack.Screen name="Employee" component={EmployeeScreen} />
            <CompanyStack.Screen name="Templates" component={TemplatesScreen} />
        </CompanyStack.Navigator>
    );
});

export default CompanyNavigator;
