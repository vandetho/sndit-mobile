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
import { BarLoader, CustomLinearGradient, PhoneField, Text } from '@components';
import { useTranslation } from 'react-i18next';
import isNumeric from 'validator/lib/isNumeric';
import { displayErrors, hasError, request, showToast } from '@utils';
import { FormType } from '@interfaces';
import { useAuthentication } from '@contexts';
import { HeaderButtons } from './components';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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

interface PhoneNumberProps {}

const PhoneNumber = React.memo<PhoneNumberProps>(() => {
    const { t } = useTranslation();
    const {
        jwt: { user },
    } = useAuthentication();
    const animatedValues = React.useRef(new Animated.Value(1)).current;
    const [state, setState] = React.useState<FormType<{ phoneNumber: string; countryCode: string }>>({
        dispatch: false,
        errors: {},
        isValid: false,
        show: {},
        touched: {
            phoneNumber: false,
            countryCode: false,
        },
        values: {
            phoneNumber: user.phoneNumber,
            countryCode: user.countryCode,
        },
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

    const onChangePhoneNumber = React.useCallback((phoneNumber: string, countryCode: string) => {
        setState((prevState) => ({
            ...prevState,
            values: {
                phoneNumber,
                countryCode,
            },
            touched: {
                phoneNumber: true,
                countryCode: true,
            },
        }));
    }, []);

    const onBlur = React.useCallback(() => {
        Animated.timing(animatedValues, { toValue: 1, useNativeDriver: true }).start();
    }, [animatedValues]);

    const onFocus = React.useCallback(() => {
        Animated.timing(animatedValues, { toValue: 0, useNativeDriver: true }).start();
    }, [animatedValues]);

    const onUpdate = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: !prevState.dispatch }));
        let data: any;
        try {
            const response = await request.put<{ phoneNumber: string }>('/api/users/current', {
                phoneNumber: state.values.phoneNumber.replace('+', ''),
                countryCode: state.values.countryCode,
            });
            data = response.data;
        } catch (e) {
            if (!e.response) {
                console.error(e);
                return;
            }
            data = e.response.data.data;
            showToast({ type: 'error', text2: e.response.data.message || e.response.data.detail });
        }
        setState((prevState) => ({ ...prevState, dispatch: !prevState.dispatch }));
        data.createdAt = new Date();
    }, [state.values.countryCode, state.values.phoneNumber]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <HeaderButtons />
                <View style={styles.contentContainer}>
                    <Animated.View
                        style={{
                            paddingTop: 30,
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
                        <Text fontSize={14}>{t('update_phone_number')}</Text>
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
                            onPress={onUpdate}
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
                                    <RNText style={{ fontFamily: 'Rubik_900Black', fontSize: 16 }}>
                                        {t('update')}
                                    </RNText>
                                )}
                            </CustomLinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default PhoneNumber;
