import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { BarLoader, CustomLinearGradient, Header, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { PALETTE } from '@theme';
import { useTheme } from '@react-navigation/native';
import CountDown from 'react-native-countdown-component';
import { Jwt } from '@interfaces';
import { request } from '@utils';
import { useApplication } from '@contexts';

const width = Dimensions.get('window').width;
const size = 50;
const styles = StyleSheet.create({
    container: {
        width,
        padding: 20,
    },
    textContainer: {
        height: 75,
    },
    borderStyleBase: {
        width: size,
        height: size,
    },
    borderStyleHighLighted: {
        borderColor: PALETTE.primary,
    },
    underlineStyleBase: {
        width: size,
        height: size,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    underlineStyleHighLighted: {
        borderColor: PALETTE.primary,
    },
});

interface VerifyOTPProps {
    phoneNumber: string;
    jwt: Jwt;
    onBack: () => void;
    onNext: () => void;
}

const VerifyOTPComponent: React.FunctionComponent<VerifyOTPProps> = ({ phoneNumber, jwt, onBack, onNext }) => {
    const { t } = useTranslation();
    const { isBeta } = useApplication();
    const inputRef = React.useRef<OTPInputView>(null);
    const { colors } = useTheme();
    const [code, setCode] = React.useState('');
    const [dispatch, setDispatch] = React.useState(false);

    const onSave = React.useCallback(
        async (code: string) => {
            if (!isBeta) {
                setDispatch((prevState) => !prevState);
                try {
                    await request.post(
                        '/api/users/verify',
                        { otp: code },
                        {
                            headers: {
                                Authorization: `Bearer ${jwt.token}`,
                            },
                        },
                    );
                } catch ({ response }) {
                    console.error(response.data.message);
                }
                setDispatch((prevState) => !prevState);
            }
            onNext();
        },
        [isBeta, jwt, onNext],
    );

    const onCodeFilled = React.useCallback(
        async (code) => {
            await onSave(code);
        },
        [onSave],
    );

    const onPress = React.useCallback(async () => {
        await onSave(code);
    }, [code, onSave]);

    return (
        <View style={styles.container}>
            <Header goBackTitle={t('back')} onGoBack={onBack} />
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
                    {t('verify_phone_number')}
                </Text>
                <Text fontSize={14}>{t('enter_otp_code_sms', { phoneNumber })}</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                }}
            >
                <Text>{t('expired_in')}:</Text>
                <CountDown
                    until={300}
                    size={20}
                    showSeparator
                    timeToShow={['M', 'S']}
                    timeLabels={{ m: null, s: null }}
                    digitStyle={{ backgroundColor: colors.background }}
                    digitTxtStyle={{ color: colors.text }}
                    separatorStyle={{ color: colors.text }}
                    timeLabelStyle={{ color: colors.text, fontFamily: 'Rubik_400Regular' }}
                />
            </View>
            <View style={{ height: 75 }}>
                <OTPInputView
                    pinCount={6}
                    autoFocusOnLoad
                    code={code}
                    onCodeChanged={setCode}
                    onCodeFilled={onCodeFilled}
                    ref={inputRef}
                    selectionColor={colors.primary}
                    codeInputFieldStyle={{
                        ...styles.underlineStyleBase,
                        fontSize: 20,
                        color: colors.text,
                        borderBottomColor: colors.text,
                    }}
                    codeInputHighlightStyle={{ ...styles.underlineStyleHighLighted, color: colors.text }}
                />
            </View>
            <TouchableOpacity style={{ marginVertical: 10 }} disabled={dispatch} onPress={onPress}>
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
                    {dispatch ? (
                        <BarLoader color="#000000" />
                    ) : (
                        <Text bold color="#000000">
                            {t('verify')}
                        </Text>
                    )}
                </CustomLinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const VerifyOTP = React.memo(VerifyOTPComponent);

export default VerifyOTP;
