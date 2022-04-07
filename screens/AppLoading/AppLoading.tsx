import React from 'react';
import { BarLoader } from '@components';
import { View } from 'react-native';

interface AppLoadingProps {}

const AppLoadingComponent: React.FunctionComponent<AppLoadingProps> = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <BarLoader />
        </View>
    );
};

const AppLoading = React.memo(AppLoadingComponent);

export default AppLoading;
