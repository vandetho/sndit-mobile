import React from 'react';
import { Animated, View } from 'react-native';
import { MenuItem } from '@interfaces';
import { ITEM_HEIGHT, SettingItem } from './components';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Text } from '@components';
import Constants from 'expo-constants';
import { useAuthentication } from '@contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList, SettingStackParamsList } from '@navigations';

type LoginScreenNavigationProps = StackNavigationProp<ApplicationStackParamsList, 'Login' | 'UserQrCode'>;

interface SettingProps {}

const Setting = React.memo<SettingProps>(() => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();
    const { isLogged, onSignOut } = useAuthentication();
    const navigation = useNavigation<LoginScreenNavigationProps>();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const inputRange = React.useMemo(() => [0, 150], []);

    const onPressUserQrCode = React.useCallback(() => {
        navigation.navigate('UserQrCode');
    }, [navigation]);

    const onPressLogin = React.useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const menu = React.useMemo(
        (): MenuItem[] => [
            ...(isLogged
                ? [
                      {
                          icon: 'user-circle',
                          text: t('account'),
                          key: 'account',
                          screen: 'AccountStack' as keyof SettingStackParamsList,
                      },
                      {
                          icon: 'qrcode',
                          text: t('user_qrcode'),
                          key: 'user-qrcode',
                          onPress: onPressUserQrCode,
                      },
                      {
                          icon: 'sign-out-alt',
                          text: t('sign_out'),
                          key: 'sign-out',
                          onPress: onSignOut,
                      },
                  ]
                : [
                      {
                          icon: 'sign-in-alt',
                          text: t('login_or_signup'),
                          key: 'login-or-signup',
                          onPress: onPressLogin,
                      },
                  ]),
        ],
        [isLogged, t, onPressUserQrCode, onSignOut, onPressLogin],
    );

    const renderItem = React.useCallback(({ item }: { item: MenuItem }) => <SettingItem item={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `setting-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({ index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index }),
        [],
    );

    const Footer = React.useCallback(
        () => (
            <View style={{ alignItems: 'center' }}>
                <Text bold style={{ marginVertical: 5 }}>
                    {t('version')}: {Constants.manifest.version}
                </Text>
            </View>
        ),
        [t],
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 150, zIndex: 1 }}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 100,
                        backgroundColor: colors.card,
                        opacity: animatedValue.interpolate({
                            inputRange: [0, 75],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    }}
                />
                <Animated.Text
                    style={{
                        fontSize: 30,
                        fontFamily: 'Rubik_900Black',
                        color: colors.text,
                        paddingTop: insets.top + 50,
                        paddingHorizontal: 30,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, -50],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {t('setting')}
                </Animated.Text>
            </View>
            <Animated.FlatList
                data={menu}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ListFooterComponent={Footer}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={{ flexGrow: 1, paddingTop: 160 }}
            />
        </View>
    );
});

export default Setting;
