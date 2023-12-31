import React from 'react';
import {
    Animated,
    Image,
    Keyboard,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarLoader, CustomLinearGradient, DatePicker, Text, TextField } from '@components';
import { axios, displayErrors, hasError, showToast } from '@utils';
import { FormType, User } from '@interfaces';
import isEmpty from 'validator/lib/isEmpty';
import { useTranslation } from 'react-i18next';
import { TOP_SECTION_HEIGHT } from '../TopSection';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingTop: TOP_SECTION_HEIGHT,
        paddingBottom: TOP_SECTION_HEIGHT,
        paddingHorizontal: 20,
    },
    textContainer: {
        marginVertical: 25,
    },
});

interface ContentSectionProps {
    user: User;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onUpdate: (user: User) => void;
}

const ContentSection = React.memo<ContentSectionProps>(({ user, onScroll, onUpdate }) => {
    const { t } = useTranslation();
    const [state, setState] = React.useState<
        FormType<{
            firstName: string;
            lastName: string;
            dob: Date | undefined;
        }>
    >({
        values: {
            dob: undefined,
            firstName: user.firstName,
            lastName: user.lastName,
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
            } = await axios.put('/api/users/current', {
                firstName: state.values.firstName,
                lastName: state.values.lastName,
                dob: state.values.dob,
                gender: 'U',
            });
            showToast({ type: 'success', text2: message });
            onUpdate(data);
        } catch (e) {
            if (e.response) {
                const { data } = e.response;
                showToast({ type: 'error', text2: data.message || data.detail });
            }
            console.error(e);
        }
        setState((prevState) => ({ ...prevState, dispatch: false }));
    }, [onUpdate, state.values.dob, state.values.firstName, state.values.lastName]);

    return (
        <Animated.ScrollView onScroll={onScroll} contentContainerStyle={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('@assets/logo.png')}
                    resizeMode="contain"
                    style={{
                        width: 150,
                        height: 150,
                    }}
                />
            </View>
            <View style={styles.textContainer}>
                <Text fontSize={14}>{t('update_user_info')}</Text>
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
            <TouchableOpacity disabled={!state.isValid || state.dispatch} onPress={onSubmit} style={{ marginTop: 20 }}>
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
                            {t('update')}
                        </Text>
                    )}
                </CustomLinearGradient>
            </TouchableOpacity>
        </Animated.ScrollView>
    );
});

export default ContentSection;
