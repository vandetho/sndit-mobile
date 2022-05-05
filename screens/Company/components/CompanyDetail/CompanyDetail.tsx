import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Company } from '@interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRoleLabel } from '@utils';
import { HeaderButton } from './components';

export const HEADER_HEIGHT = 200;

const styles = StyleSheet.create({
    container: {
        height: HEADER_HEIGHT,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
});

interface CompanyDetailProps {
    animatedValue: Animated.Value;
    company: Company;
}

const CompanyDetailComponent: React.FunctionComponent<CompanyDetailProps> = ({ animatedValue, company }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const renderRole = React.useCallback(() => t(getRoleLabel(company.roles)), [company.roles, t]);

    const inputRange = React.useMemo<Array<number>>(() => [0, HEADER_HEIGHT], []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -80],
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
                    backgroundColor: colors.card,
                    height: HEADER_HEIGHT,
                    opacity: animatedValue.interpolate({
                        inputRange,
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                }}
            />
            <Animated.View
                style={{
                    marginTop: insets.top,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    zIndex: 1,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 70],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <HeaderButton />
            </Animated.View>
            <View style={{ padding: 10, borderRadius: 15, backgroundColor: colors.card, marginHorizontal: 10 }}>
                <Animated.Text
                    style={{
                        color: colors.text,
                        fontFamily: 'Rubik_900Black',
                        fontSize: 16,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 60],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {company.name}
                </Animated.Text>
                <Animated.Text
                    style={{
                        color: colors.text,
                        fontFamily: 'Rubik_900Black',
                        fontSize: 16,
                        marginVertical: 10,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 25],
                                    extrapolate: 'clamp',
                                }),
                            },
                            {
                                translateX: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 300],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {renderRole()}
                </Animated.Text>
            </View>
        </Animated.View>
    );
};

const CompanyDetail = React.memo(CompanyDetailComponent);

export default CompanyDetail;
