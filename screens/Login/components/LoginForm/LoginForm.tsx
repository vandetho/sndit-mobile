import React from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    Text as RNText,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { BarLoader, CustomLinearGradient, Header, PhoneField, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { AxiosResponse } from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import isNumeric from 'validator/lib/isNumeric';
import { displayErrors, hasError, request, showToast } from '@utils';
import { FormType, Jwt } from '@interfaces';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width,
        padding: 20,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    textContainer: {
        marginBottom: 50,
    },
});

interface LoginFormProps {
    phoneNumber: string;
    onNext: (phoneNumber: string, jwt: Jwt, isRegister: boolean) => void;
}

const LoginForm = React.memo<LoginFormProps>(({ phoneNumber, onNext }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const animatedValues = React.useRef(new Animated.Value(1)).current;
    const [state, setState] = React.useState<FormType<{ phoneNumber: string }>>({
        dispatch: false,
        errors: {},
        isValid: false,
        show: {},
        touched: {
            phoneNumber: false,
        },
        values: { phoneNumber },
    });

    React.useEffect(() => {
        const errors: { [key: string]: string } = {};
        if (!isNumeric(state.values.phoneNumber)) {
            errors['phoneNumber'] = t('phone_number_invalid');
        }
        setState((formState) => ({
            ...formState,
            isValid: Object.keys(errors).length === 0,
            errors: errors,
        }));
    }, [state.values, t]);

    const onChangePhoneNumber = React.useCallback((phoneNumber: string) => {
        setState((prevState) => ({
            ...prevState,
            values: {
                phoneNumber,
            },
            touched: {
                phoneNumber: true,
            },
        }));
    }, []);

    const onBlur = React.useCallback(() => {
        Animated.timing(animatedValues, { toValue: 1, useNativeDriver: true }).start();
    }, [animatedValues]);

    const onFocus = React.useCallback(() => {
        Animated.timing(animatedValues, { toValue: 0, useNativeDriver: true }).start();
    }, [animatedValues]);

    const onLogin = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: !prevState.dispatch }));
        let data: any;
        let isRegister = false;
        try {
            const response = await request.post<
                { phoneNumber: string },
                AxiosResponse<{ token: string; refreshToken: string }>
            >('/api/login_check', { phoneNumber: state.values.phoneNumber.replace('+', '') });
            data = response.data;
        } catch (e) {
            if (!e.response) {
                console.error(e);
                return;
            }
            data = e.response.data.data;
            showToast({ type: 'error', text2: e.response.data.message || e.response.data.detail });
            isRegister = true;
        }
        setState((prevState) => ({ ...prevState, dispatch: !prevState.dispatch }));
        data.createdAt = new Date();
        onNext(state.values.phoneNumber, data, isRegister);
    }, [onNext, state.values.phoneNumber]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Header goBackTitle={t('close')} goBackIcon="times" />
                <View style={styles.contentContainer}>
                    <Animated.View
                        style={{
                            paddingTop: insets.top + 50,
                            paddingBottom: 30,
                            opacity: animatedValues,
                            transform: [
                                {
                                    translateY: animatedValues.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-400, 0],
                                    }),
                                },
                                {
                                    scale: animatedValues,
                                },
                            ],
                        }}
                    >
                        <Image
                            source={require('@assets/logo.png')}
                            resizeMode="contain"
                            style={{
                                width: 250,
                                height: 150,
                            }}
                        />
                    </Animated.View>
                    <Animated.View
                        style={[
                            styles.textContainer,
                            {
                                transform: [
                                    {
                                        translateY: animatedValues.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-200, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <Text fontSize={20} bold>
                            {t('welcome_sndit')}
                        </Text>
                        <Text fontSize={14}>{t('enter_phone_number_login_register')}</Text>
                    </Animated.View>
                    <Animated.View
                        style={{
                            width: width - 40,
                            transform: [
                                {
                                    translateY: animatedValues.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-200, 0],
                                    }),
                                },
                            ],
                        }}
                    >
                        <PhoneField
                            error={hasError('phoneNumber', state)}
                            textHelper={displayErrors('phoneNumber', state)}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            value={state.values.phoneNumber}
                            onChangePhoneNumber={onChangePhoneNumber}
                        />
                    </Animated.View>
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    translateY: animatedValues.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-200, 0],
                                    }),
                                },
                            ],
                        }}
                    >
                        <TouchableOpacity
                            disabled={!state.isValid || state.dispatch}
                            style={{ marginTop: 10 }}
                            onPress={onLogin}
                        >
                            <CustomLinearGradient
                                style={{
                                    borderRadius: 25,
                                    height: 50,
                                    width: width - 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                }}
                            >
                                {state.dispatch ? (
                                    <BarLoader color="#000000" />
                                ) : (
                                    <RNText style={{ fontFamily: 'Rubik_900Black', fontSize: 16 }}>{t('login')}</RNText>
                                )}
                            </CustomLinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default LoginForm;
