import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Header } from '@components';

export const HEADER_HEIGHT = 125;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: HEADER_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        zIndex: 1,
    },
});

interface HeaderSectionProps {
    animatedValue: Animated.Value;
}

const HeaderSectionComponent: React.FunctionComponent<HeaderSectionProps> = ({ animatedValue }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const inputRange = React.useMemo(() => [0, HEADER_HEIGHT], []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingTop: 50,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -25],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_HEIGHT,
                    backgroundColor: colors.card,
                    opacity: animatedValue.interpolate({
                        inputRange,
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                }}
            />
            <Animated.View
                style={{
                    marginBottom: 10,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 25],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Header goBackTitle={t('back')} />
            </Animated.View>
            <Animated.Text
                style={{
                    color: colors.primary,
                    fontFamily: 'Rubik_900Black',
                    fontSize: 24,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -25],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            translateX: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 75],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            scale: animatedValue.interpolate({
                                inputRange,
                                outputRange: [1, 0.75],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                {t('notifications')}
            </Animated.Text>
        </Animated.View>
    );
};

const HeaderSection = React.memo(HeaderSectionComponent);

export default HeaderSection;
