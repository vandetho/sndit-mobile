import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Header } from '@components';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PACKAGE } from '../../../../workflows';
import { ROLES } from '@config';
import { useAuthentication } from '@contexts';

export const HEADER_HEIGHT = 180;

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

interface PackageDetailProps {
    animatedValue: Animated.Value;
    item: Package;
}

const PackageDetailComponent: React.FunctionComponent<PackageDetailProps> = ({ animatedValue, item }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const {
        jwt: { user },
    } = useAuthentication();

    const inputRange = React.useMemo<Array<number>>(() => [0, HEADER_HEIGHT], []);

    const renderButtons = React.useCallback(() => {
        const buttons: JSX.Element[] = [];
        const keys = Object.keys(item.marking);
        if (keys.includes(PACKAGE.WAITING_FOR_DELIVERY)) {
            if (item.roles.includes(ROLES.MANAGER)) {
                buttons.push(<Button label={t('give_to_deliverer')} />);
            }
            buttons.push(<Button label={t('take_package')} />);
        }
        if (
            keys.includes(PACKAGE.ON_DELIVERY) &&
            (item.roles.includes(ROLES.MANAGER) || item.deliverer.id === user.id)
        ) {
        }
        return <View>{buttons}</View>;
    }, [item.deliverer, item.marking, item.roles, t, user]);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -50],
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
                                outputRange: [0, 50],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Header goBackTitle={t('back')} />
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
                                    outputRange: [0, 40],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {item.name}
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
                                    outputRange: [0, 10],
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
                    {item.address}
                </Animated.Text>
            </View>
            {renderButtons()}
        </Animated.View>
    );
};

const PackageDetail = React.memo(PackageDetailComponent);

export default PackageDetail;
