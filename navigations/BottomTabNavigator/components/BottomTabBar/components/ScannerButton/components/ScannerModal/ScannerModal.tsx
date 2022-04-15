import React from 'react';
import Modal from 'react-native-modal';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { showToast } from '@utils';
import { BarLoader, Header, ScannerMask } from '@components';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CompositeNavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { ApplicationStackParamsList, CompanyStackParamList, PackageStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCompany, useEmployee, usePackage } from '@contexts';
import { useCompanyFetcher, useEmployeeFetcher, usePackageFetcher } from '@fetchers';

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

type RedirectScreenNavigationProps = CompositeNavigationProp<
    CompositeNavigationProp<
        StackNavigationProp<CompanyStackParamList, 'Company' | 'Employee'>,
        StackNavigationProp<PackageStackParamList, 'Package'>
    >,
    StackNavigationProp<ApplicationStackParamsList, 'User'>
>;

interface ScannerModalProps {
    visible: boolean;
    onClose: () => void;
}

const ScannerModalComponent: React.FunctionComponent<ScannerModalProps> = ({ visible, onClose }) => {
    const { colors } = useTheme();
    const { height } = useWindowDimensions();
    const { t } = useTranslation();
    const navigation = useNavigation<RedirectScreenNavigationProps>();
    const { onSelect: onSelectCompany } = useCompany();
    const { onSelect: onSelectEmployee } = useEmployee();
    const { onSelect: onSelectPackage } = usePackage();
    const { fetch: fetchEmployee, isLoading: isLoadingEmployee, employee } = useEmployeeFetcher();
    const { fetch: fetchPackage, isLoading: isLoadingPackage, item } = usePackageFetcher();
    const { fetch: fetchCompany, isLoading: isLoadingCompany, company } = useCompanyFetcher();
    const [state, setState] = React.useState<{
        left: number;
        top: number;
        height: number;
        width: number;
        scanned: boolean;
        type: string;
        data: string | null;
        hasPermission: boolean | null;
    }>({
        height: 0,
        type: '',
        scanned: false,
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

    React.useEffect(() => {
        if (employee || item || company) {
            const selectFunc = {
                company: () => {
                    onSelectCompany(company);
                },
                employee: () => onSelectEmployee(employee),
                package: () => onSelectPackage(item),
            };
            if (selectFunc[state.type]) {
                selectFunc[state.type]();
                navigation.navigate(state.type as any);
            }
        }
    }, [company, employee, item, navigation, onSelectCompany, onSelectEmployee, onSelectPackage, state.type]);

    const pointerFunc = React.useCallback(
        (type: string) => {
            const func = {
                company: fetchCompany,
                package: fetchPackage,
                employee: fetchEmployee,
            };
            if (func[type]) {
                func[type]();
                setState((prevState) => ({ ...prevState, type }));
                return;
            }
            showToast({ type: 'error', text2: t('invalid_qr_code') });
        },
        [fetchCompany, fetchEmployee, fetchPackage, t],
    );

    const handleCodeScanned = React.useCallback(
        async ({ data, bounds }: BarCodeEvent) => {
            setState((prevState) => ({
                ...prevState,
                scanned: true,
                isLoading: true,
                type: '',
                width: bounds.size.width,
                height: bounds.size.height,
                top: bounds.origin.y,
                left: bounds.origin.x,
            }));
            try {
                const infos = data.split(':');
                if (infos.length !== 2 && ['package', 'user', 'employee', 'company'].includes(infos[0])) {
                    showToast({ type: 'error', text2: t('invalid_qr_code') });
                    return;
                }
                pointerFunc(infos[0]);
                onClose();
            } catch (e) {
                if (e.response) {
                    const {
                        response: { data },
                    } = e;
                    showToast({ type: 'error', text2: data.message || data.detail });
                }
                console.error(e);
            }
            setState((prevState) => ({ ...prevState, scanned: false, isLoading: false }));
        },
        [onClose, pointerFunc, t],
    );

    const renderMask = React.useCallback(() => {
        const { scanned, ...bounds } = state;
        if (isLoadingCompany || isLoadingEmployee || isLoadingPackage) {
            return <BarLoader />;
        }
        return <ScannerMask visible={scanned} bounds={bounds} />;
    }, [isLoadingCompany, isLoadingEmployee, isLoadingPackage, state]);

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
