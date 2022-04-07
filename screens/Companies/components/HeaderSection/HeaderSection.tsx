import React from 'react';
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components';

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
    onPressAddCompany: () => void;
}

const HeaderSectionComponent: React.FunctionComponent<HeaderSectionProps> = ({ animatedValue, onPressAddCompany }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const inputRange = React.useMemo(() => [0, HEADER_HEIGHT], []);
    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_HEIGHT - 20,
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
                    color: colors.text,
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
                                outputRange: [0, 10],
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
            <TouchableWithoutFeedback onPress={onPressAddCompany}>
                <Animated.View
                    style={{
                        width: 40,
                        height: 40,
                        marginBottom: 10,
                        opacity: animatedValue.interpolate({
                            inputRange,
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                        transform: [
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [-50, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    <GradientIcon name="plus" />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const HeaderSection = React.memo(HeaderSectionComponent);

export default HeaderSection;
