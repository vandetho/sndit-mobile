import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';

interface AppLoadingProps {
    onComplete: (complete: boolean) => void;
}

const AppLoadingComponent: React.FunctionComponent<AppLoadingProps> = ({ onComplete }) => {
    const animation = React.useRef(new Animated.Value(1)).current;

    const handleComplete = React.useCallback(async () => {
        try {
            await SplashScreen.hideAsync();
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => onComplete(true));
        } catch (e) {}
    }, [animation, onComplete]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: Constants.manifest.splash.backgroundColor,
                        opacity: animation,
                    },
                ]}
            >
                <LottieView
                    autoPlay
                    onAnimationFinish={handleComplete}
                    source={require('@assets/animated-logo.json')}
                />
            </Animated.View>
        </View>
    );
};

const AppLoading = React.memo(AppLoadingComponent);

export default AppLoading;
