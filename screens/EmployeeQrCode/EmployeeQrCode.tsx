import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PALETTE } from '@theme';
import { GradientIcon, Text } from '@components';
import { useEmployee } from '@contexts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
        padding: 20,
        borderRadius: 40,
    },
});

interface EmployeeQrCodeProps {}

const EmployeeQrCode = React.memo<EmployeeQrCodeProps>(() => {
    const { employee } = useEmployee();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const onPress = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <QRCode
                value={`employee:${employee.token}`}
                logoSize={30}
                enableLinearGradient
                linearGradient={[PALETTE.primary, PALETTE.secondary]}
                size={220}
                backgroundColor={colors.card}
            />
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]} onPress={onPress}>
                <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
                <GradientIcon name="times" />
            </TouchableOpacity>
        </View>
    );
});

export default EmployeeQrCode;
