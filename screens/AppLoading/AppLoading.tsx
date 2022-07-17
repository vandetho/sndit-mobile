import React from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

interface AppLoadingProps {
    onComplete: (complete: boolean) => void;
}

const AppLoadingComponent: React.FunctionComponent<AppLoadingProps> = ({ onComplete }) => {
    const handleComplete = React.useCallback(async () => {
        onComplete(true);
    }, [onComplete]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                autoPlay
                loop={false}
                onAnimationFinish={handleComplete}
                source={require('@assets/animated-logo.json')}
            />
        </View>
    );
};

const AppLoading = React.memo(AppLoadingComponent);

export default AppLoading;
