import React from 'react';
import Modal from 'react-native-modal';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { showToast } from '@utils';
import { BarLoader, Header, ScannerMask } from '@components';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        margin: 10,
    },
    maskViewContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    barcodeScanner: {
        ...StyleSheet.absoluteFillObject,
    },
});

interface ScannerModalProps {
    visible: boolean;
    onClose: () => void;
}

const ScannerModalComponent: React.FunctionComponent<ScannerModalProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const { height } = useWindowDimensions();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [state, setState] = React.useState<{
        left: number;
        top: number;
        height: number;
        width: number;
        scanned: boolean;
        data: string | null;
        hasPermission: boolean | null;
        isLoading: boolean;
    }>({
        height: 0,
        scanned: false,
        isLoading: false,
        hasPermission: null,
        width: 0,
        left: 0,
        top: 0,
        data: null,
    });

    React.useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setState((prevState) => ({ ...prevState, hasPermission: status === 'granted' }));
        })();
    }, []);

    const handleCodeScanned = React.useCallback(
        async ({ data, bounds }: BarCodeEvent) => {
            setState((prevState) => ({
                ...prevState,
                scanned: true,
                isLoading: true,
                width: bounds.size.width,
                height: bounds.size.height,
                top: bounds.origin.y,
                left: bounds.origin.x,
            }));
            try {
                onClose();
            } catch (e) {
                if (e.response) {
                    const {
                        response: { data },
                    } = e;
                    showToast(data.message || data.detail);
                }
                console.error(e);
            }
            setState((prevState) => ({ ...prevState, scanned: false, isLoading: false }));
        },
        [navigation, onClose],
    );

    const renderMask = React.useCallback(() => {
        const { scanned, data, hasPermission, isLoading, ...bounds } = state;
        if (isLoading) {
            return <BarLoader />;
        }
        return <ScannerMask visible={scanned} bounds={bounds} />;
    }, [state]);

    if (state.hasPermission === null) {
        return <Text>{t('requesting_camera_permission')}</Text>;
    }
    if (state.hasPermission === false) {
        return <Text>{t('no_access_camera')}</Text>;
    }

    return (
        <Modal isVisible={visible} onBackdropPress={onClose} style={{ margin: 0, justifyContent: 'flex-end' }}>
            <View style={{ height: height * 0.9, backgroundColor: colors.card, borderRadius: 20 }}>
                <View style={styles.headerContainer}>
                    <Header goBackIcon="times" goBackTitle={t('close')} onGoBack={onClose} />
                </View>
                <View style={styles.container}>
                    {visible && (
                        <BarCodeScanner
                            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                            onBarCodeScanned={state.scanned ? undefined : handleCodeScanned}
                            style={styles.barcodeScanner}
                        />
                    )}
                    <View style={styles.maskViewContainer}>{renderMask()}</View>
                </View>
            </View>
        </Modal>
    );
};

const ScannerModal = React.memo(ScannerModalComponent);

export default ScannerModal;
