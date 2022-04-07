import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { CompaniesScreen, CompanyScreen, NewCompanyScreen } from '@screens';

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
            <CompanyStack.Screen
                name="NewCompany"
                component={NewCompanyScreen}
                options={{
                    presentation: 'modal',
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                }}
            />
        </CompanyStack.Navigator>
    );
});

export default CompanyNavigator;
