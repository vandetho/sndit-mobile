import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderButton } from './components';

export const HEADER_HEIGHT = 130;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: HEADER_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
});

interface HeaderSectionProps {
    animatedValue: Animated.Value;
    onPressNew: () => void;
}

const HeaderSectionComponent: React.FunctionComponent<HeaderSectionProps> = ({ animatedValue, onPressNew }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const inputRange = React.useMemo(() => [0, HEADER_HEIGHT], []);

    return (
        <View style={styles.container}>
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
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -35],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            />
            <Animated.View
                style={{
                    marginTop: insets.top,
                    marginHorizontal: 10,
                    marginBottom: 10,
                }}
            >
                <HeaderButton onPressNew={onPressNew} />
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
                                outputRange: [0, -50],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            translateX: animatedValue.interpolate({
                                inputRange,
                                outputRange: [10, 100],
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
                {t('templates')}
            </Animated.Text>
        </View>
    );
};

const HeaderSection = React.memo(HeaderSectionComponent);

export default HeaderSection;
