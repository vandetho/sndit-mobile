import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const HEADER_HEIGHT = 100;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: HEADER_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'flex-end',
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
            <Animated.Text
                style={{
                    color: colors.primary,
                    fontFamily: 'Rubik_900Black',
                    fontSize: 24,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            translateX: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 5],
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
                {t('companies')}
            </Animated.Text>
        </Animated.View>
    );
};

const HeaderSection = React.memo(HeaderSectionComponent);

export default HeaderSection;
