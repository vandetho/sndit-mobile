import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Header, Text } from '@components';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PACKAGE } from '../../../../workflows';
import { ROLES } from '@config';
import { useAuthentication } from '@contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import axios from 'axios';
import { TakePackageButton } from '@screens/Package/components/PackageDetail/components';

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

type PackageQrCodeScreenNavigationProps = StackNavigationProp<ApplicationStackParamsList, 'PackageQrCode'>;

interface PackageDetailProps {
    animatedValue: Animated.Value;
    item: Package;
}

const PackageDetailComponent: React.FunctionComponent<PackageDetailProps> = ({ animatedValue, item }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<PackageQrCodeScreenNavigationProps>();
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
                buttons.push(<Button label={t('give_to_deliverer')} style={{ margin: 10, borderRadius: 15 }} />);
            }
            buttons.push(<TakePackageButton item={item} />);
        }
        if (
            keys.includes(PACKAGE.ON_DELIVERY) &&
            (item.roles.includes(ROLES.MANAGER) || (item.deliverer && item.deliverer.id === user.id))
        ) {
            buttons.push(<Button label={t('delivered')} style={{ margin: 10, borderRadius: 15 }} />);
        }
        return <View>{buttons}</View>;
    }, [item.deliverer, item.marking, item.roles, t, user]);

    const renderMarking = React.useCallback(
        () =>
            Object.keys(item.marking).map((marking, index) => (
                <Text key={`package-${item.id}-marking-${index}`}>{t(marking)}</Text>
            )),
        [item.id, item.marking, t],
    );

    const onPressQrCode = React.useCallback(() => {
        navigation.navigate('PackageQrCode');
    }, [navigation]);

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
                <Header
                    goBackTitle={t('back')}
                    onRightButtonPress={onPressQrCode}
                    headerRightSize={20}
                    headerRightIcon="qrcode"
                />
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
