import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Backdrop, BarLoader, GradientIcon, ScannerMask, Text } from '@components';
import { CompositeNavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList, CompanyStackParamList } from '@navigations';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { showToast } from '@utils';
import { useUserFetcher } from '@fetchers';
import { useUser } from '@contexts';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

type CompanyScreenNavigationProps = CompositeNavigationProp<
    StackNavigationProp<ApplicationStackParamsList, 'CompanyQrCode' | 'User'>,
    StackNavigationProp<CompanyStackParamList, 'Employees'>
>;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PADDING,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
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

interface HeaderButtonProps {}

const HeaderButtonComponent: React.FunctionComponent<HeaderButtonProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<CompanyScreenNavigationProps>();
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
    const { onSelect } = useUser();
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
    const { user, isLoading } = useUserFetcher();

    React.useEffect(() => {
        if (user) {
            onSelect(user);
            navigation.navigate('User');
        }
    }, [navigation, onSelect, state.type, user]);

    const snapPoints = React.useMemo(() => ['50%', '75%'], []);

    const handlePresentModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const handleCloseModalPress = React.useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
    }, []);

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
                type: '',
                width: bounds.size.width,
                height: bounds.size.height,
                top: bounds.origin.y,
                left: bounds.origin.x,
            }));
            try {
                const infos = data.split(':');
                if (infos.length !== 2 && ['user'].includes(infos[0])) {
                    showToast({ type: 'error', text2: t('invalid_qr_code') });
                    return;
                }
                await fetch(data);
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
        [t],
    );

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const renderMask = React.useCallback(() => {
        const { scanned, ...bounds } = state;
        if (isLoading) {
            return <BarLoader />;
        }
        return <ScannerMask visible={scanned} bounds={bounds} />;
    }, [isLoading, state]);

    if (state.hasPermission === null) {
        return <Text>{t('requesting_camera_permission')}</Text>;
    }
    if (state.hasPermission === false) {
        return <Text>{t('no_access_camera')}</Text>;
    }

    return (
        <React.Fragment>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                    onPress={handleGoBack}
                >
                    <GradientIcon name="chevron-left" />
                    <Text style={{ marginHorizontal: 10 }}>{t('back')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                    onPress={handlePresentModalPress}
                >
                    <GradientIcon name="user-plus" size={20} />
                </TouchableOpacity>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: colors.card }}
                handleIndicatorStyle={{ backgroundColor: colors.text }}
                backdropComponent={Backdrop}
            >
                <View style={styles.contentContainer}>
                    <View
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            zIndex: 1,
                        }}
                    >
                        <TouchableOpacity
                            style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                            onPress={handleCloseModalPress}
                        >
                            <GradientIcon name="times" />
                            <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                    <BarCodeScanner
                        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                        onBarCodeScanned={state.scanned ? undefined : handleCodeScanned}
                        style={styles.barcodeScanner}
                    />
                    <View style={styles.maskViewContainer}>{renderMask()}</View>
                </View>
            </BottomSheetModal>
        </React.Fragment>
    );
};

const HeaderButton = React.memo(HeaderButtonComponent);

export default HeaderButton;
