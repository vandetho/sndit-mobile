import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { PALETTE } from '@theme';
import { GradientIcon, Text } from '@components';
import { usePackage } from '@contexts';

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

interface PackageQrCodeProps {}

const PackageQrCode = React.memo<PackageQrCodeProps>(() => {
    const { package: pkg } = usePackage();
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <QRCode
                value={`package:${pkg.token}`}
                logoSize={30}
                enableLinearGradient
                linearGradient={[PALETTE.primary, PALETTE.secondary]}
                size={220}
                backgroundColor={colors.card}
            />
            <TouchableOpacity style={[styles.closeButton, { backgroundColor: colors.card }]}>
                <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
                <GradientIcon name="time" />
            </TouchableOpacity>
        </View>
    );
});

export default PackageQrCode;
