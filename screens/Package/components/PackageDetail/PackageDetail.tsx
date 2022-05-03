import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PACKAGE } from '@workflows';
import { ROLES } from '@config';
import { useAuthentication } from '@contexts';
import { DeliveredButton, GiveToDelivererButton, HeaderButton, PrintButton, TakePackageButton } from './components';

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
    onDone: () => void;
    onPress: () => void;
}

const PackageDetailComponent: React.FunctionComponent<PackageDetailProps> = ({
    animatedValue,
    item,
    onDone,
    onPress,
}) => {
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
                buttons.push(
                    <GiveToDelivererButton
                        item={item}
                        onPress={onPress}
                        onDone={onDone}
                        key={`package-${item.id}-detail-button-give-to-deliverer`}
                    />,
                );
            }
            buttons.push(
                <TakePackageButton
                    item={item}
                    onPress={onPress}
                    onDone={onDone}
                    key={`package-${item.id}-detail-button-take-package`}
                />,
            );
        }
        if (
            keys.includes(PACKAGE.ON_DELIVERY) &&
            (item.roles.includes(ROLES.MANAGER) || (item.deliverer && user && item.deliverer.id === user.id))
        ) {
            buttons.push(
                <DeliveredButton
                    item={item}
                    onPress={onPress}
                    onDone={onDone}
                    key={`package-${item.id}-detail-button-delivered`}
                />,
            );
        }
        if (item.roles.includes(ROLES.MANAGER)) {
            buttons.push(
                <PrintButton
                    item={item}
                    onPress={onPress}
                    onDone={onDone}
                    key={`package-${item.id}-detail-button-print`}
                />,
            );
        }
        return <View>{buttons}</View>;
    }, [item, onDone, onPress, user]);

    const renderMarking = React.useCallback(
        () =>
            Object.keys(item.marking).map((marking, index) => (
                <Text key={`package-${item.id}-marking-${index}`}>{t(marking)}</Text>
            )),
        [item.id, item.marking, t],
    );

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
                <HeaderButton item={item} />
            </Animated.View>
            <View
                style={{
                    padding: 10,
                    borderRadius: 15,
                    justifyContent: 'space-between',
                    backgroundColor: colors.card,
                    marginHorizontal: 10,
                }}
            >
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
                {item.city && <Text>{item.city.name}</Text>}
                {renderMarking()}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                            {t('created_by')}
                        </Text>
                        <Text>
                            {item.creator.lastName} {item.creator.firstName}
                        </Text>
                    </View>
                    {item.deliverer && (
                        <View>
                            <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                                {t('delivered_by')}
                            </Text>
                            <Text>
                                {item.deliverer.lastName} {item.deliverer.firstName}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            {renderButtons()}
        </Animated.View>
    );
};

const PackageDetail = React.memo(PackageDetailComponent);

export default PackageDetail;
