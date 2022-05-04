import React from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { BarLoader, CustomLinearGradient, DatePicker, Text, TextField } from '@components';
import { useTranslation } from 'react-i18next';
import { FormType } from '@interfaces/FormType';
import { Jwt, User } from '@interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import isEmpty from 'validator/lib/isEmpty';
import { request, showToast, displayErrors, hasError } from '@utils';

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        width,
        paddingHorizontal: 20,
    },
    textContainer: {
        marginBottom: 25,
    },
});

interface RegisterProps {
    phoneNumber: string;
    jwt: Jwt;
    onRegistered: (user: User) => void;
}

const Register = React.memo<RegisterProps>(({ phoneNumber, jwt, onRegistered }) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [state, setState] = React.useState<
        FormType<{
            firstName: string;
            lastName: string;
            dob: Date | undefined;
        }>
    >({
        values: {
            dob: undefined,
            firstName: '',
            lastName: '',
        },
        touched: {
            dob: false,
            firstName: false,
            lastName: false,
        },
        dispatch: false,
        isValid: false,
    });

    React.useEffect(() => {
        const errors: { [key: string]: string } = {};
        if (isEmpty(state.values.firstName)) {
            errors.firstName = t('first_name_required');
        }
        if (isEmpty(state.values.lastName)) {
            errors.lastName = t('last_name_required');
        }
        setState((formState) => ({
            ...formState,
            isValid: Object.keys(errors).length === 0,
            errors: errors,
        }));
    }, [state.values, t]);

    const onChangeText = React.useCallback((text: any, name: string) => {
        setState((prevState) => ({
            ...prevState,
            values: { ...prevState.values, [name]: text },
            touched: { ...prevState.touched, [name]: true },
        }));
    }, []);

    const onSubmit = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: true }));
        try {
            const {
                data: { data, message },
            } = await request.put(
                '/api/users/current',
                {
                    phoneNumber: phoneNumber.replace('+', ''),
                    firstName: state.values.firstName,
                    lastName: state.values.lastName,
                    dob: state.values.dob,
                    gender: 'U',
                },
                {
                    headers: {
                        Authorization: `Bearer ${jwt.token}`,
                    },
                },
            );
            showToast({ type: 'success', text2: message });
            onRegistered(data);
        } catch (e) {
            if (e.response) {
                const { data } = e.response;
                showToast({ type: 'error', text2: data.message || data.detail });
            }
            console.error(e);
        }
        setState((prevState) => ({ ...prevState, dispatch: false }));
    }, [jwt, onRegistered, phoneNumber, state.values.dob, state.values.firstName, state.values.lastName]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={{ paddingVertical: 30, width, alignItems: 'center' }}>
                    <Image
                        source={require('@assets/logo.png')}
                        resizeMode="contain"
                        style={{
                            width: 250,
                            height: 150,
                        }}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text fontSize={20} bold>
                        {t('not_register')}
                    </Text>
                    <Text fontSize={14}>{t('fill_user_info')}</Text>
                </View>
                <TextField
                    label={t('first_name')}
                    name="firstName"
                    required
                    value={state.values.firstName}
                    error={hasError('firstName', state)}
                    textHelper={displayErrors('firstName', state)}
                    onChangeText={onChangeText}
                />
                <TextField
                    label={t('last_name')}
                    name="lastName"
                    required
                    value={state.values.lastName}
                    error={hasError('lastName', state)}
                    textHelper={displayErrors('lastName', state)}
                    onChangeText={onChangeText}
                />
                <DatePicker
                    value={state.values.dob}
                    label={t('dob')}
                    onOpen={Keyboard.dismiss}
                    onClose={Keyboard.dismiss}
                    clearable
                    maxDate={new Date()}
                    name="dob"
                    onChange={onChangeText}
                />
                <TouchableOpacity
                    disabled={!state.isValid || state.dispatch}
                    onPress={onSubmit}
                    style={{ marginTop: 20 }}
                >
                    <CustomLinearGradient
                        style={{
                            height: 50,
                            borderRadius: 25,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        {state.dispatch ? (
                            <BarLoader color="#000000" />
                        ) : (
                            <Text bold color="#000000">
                                {t('register')}
                            </Text>
                        )}
                    </CustomLinearGradient>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default Register;
