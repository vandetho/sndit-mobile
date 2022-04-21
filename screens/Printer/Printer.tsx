import React from 'react';
import {
    DeviceEventEmitter,
    EmitterSubscription,
    NativeEventEmitter,
    PixelRatio,
    Platform,
    SectionList,
    SectionListData,
    Text as RNText,
    ToastAndroid,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { BarLoader, Text } from '@components';
import QRCode from 'react-native-qrcode-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT, TOAST_DURATION } from '@config';

interface PrinterProps {}

const _listeners: EmitterSubscription[] = [];

type Device = { name?: string; address: string };

const Printer: React.FunctionComponent<PrinterProps> = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const viewRef = React.useRef<View>(null);
    const navigation = useNavigation();
    const asyncStorage = useAsyncStorage('@connected_printer');
    const { deliveryInformation, order } = useSelector<
        AppState,
        { deliveryInformation: DeliveryInformationType; order: Order }
    >((state) => ({
        deliveryInformation: state.deliveryInformation.selected,
        order: state.order.selected,
    }));
    const [state, setState] = React.useState<{
        devices: null;
        pairedDevices: Device[];
        foundDevices: Device[];
        connectedDevice: Device;
        isLoading: boolean;
        isConnecting: boolean;
        isPrinting: boolean;
    }>({
        devices: null,
        pairedDevices: [],
        foundDevices: [],
        connectedDevice: undefined,
        isLoading: true,
        isConnecting: false,
        isPrinting: false,
    });

    const onScanDevices = React.useCallback(() => {
        BluetoothManager.scanDevices();
    }, []);

    const setPairedDevices = React.useCallback(async (rsp) => {
        const devices = typeof rsp.devices == 'object' ? rsp.devices : JSON.parse(rsp.devices);
        if (devices) {
            setState((prevState) => ({ ...prevState, pairedDevices: devices, isLoading: false }));
        }
    }, []);

    const setFoundDevices = React.useCallback(
        (rsp) => {
            const device: Device = typeof rsp.device == 'object' ? rsp.devices : JSON.parse(rsp.device);
            if (device) {
                const foundDevices = [...state.foundDevices];
                if (!foundDevices.find((d) => d.address === device.address)) {
                    foundDevices.push(device);
                }
                setState((prevState) => ({ ...prevState, foundDevices, isLoading: false }));
            }
        },
        [state.foundDevices],
    );

    const onPrint = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, isPrinting: true }));
        const pixelRatio = PixelRatio.get();
    }, [t]);

    React.useEffect(() => {
        asyncStorage.getItem().then((value) => {
            if (value) {
                const device: Device = JSON.parse(value);
                const connectedDevice = state.connectedDevice;
                if (
                    device.address !== connectedDevice?.address &&
                    state.pairedDevices.find((paired) => device.address === paired.address)
                ) {
                    BluetoothManager.connect(device.address)
                        .then(() => {
                            setState((prevState) => ({
                                ...prevState,
                                connectedDevice: device,
                                isConnecting: false,
                            }));
                        })
                        .catch((e) => {
                            Toast.show(e.message, {
                                position: Toast.positions.CENTER,
                                duration: TOAST_DURATION,
                            });
                            setState((prevState) => ({
                                ...prevState,
                                isConnecting: false,
                            }));
                        });
                }
            }
        });
    }, [asyncStorage, state.connectedDevice, state.pairedDevices]);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableWithoutFeedback
                    disabled={state.connectedDevice === undefined || state.isPrinting}
                    onPress={onPrint}
                >
                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                        <Text style={{ color: PRIMARY, marginRight: 10 }}>{t('print')}</Text>
                        {state.isPrinting ? (
                            <BarLoader color={PRIMARY} />
                        ) : (
                            <MaterialIcons name="print" size={24} color={PRIMARY} />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            ),
        });
    }, [navigation, onPrint, state.connectedDevice, state.isPrinting, t]);

    React.useEffect(() => {
        BluetoothManager.isBluetoothEnabled().then(
            (enabled) => {
                setState((prevState) => ({ ...prevState, bleOpened: Boolean(enabled), isLoading: false }));
            },
            (err) => {
                err;
            },
        );
        if (Platform.OS === 'ios') {
            const bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
            _listeners.push(
                bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
                    setPairedDevices(rsp);
                }),
            );
            _listeners.push(
                bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
                    setFoundDevices(rsp);
                }),
            );
            _listeners.push(
                bluetoothManagerEmitter.addListener(BluetoothManager.EVENT_CONNECTION_LOST, () => {
                    setState((prevState) => ({ ...prevState, name: '', boundAddress: '' }));
                }),
            );
        } else if (Platform.OS === 'android') {
            _listeners.push(
                DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED, (rsp) => {
                    setPairedDevices(rsp);
                }),
            );
            _listeners.push(
                DeviceEventEmitter.addListener(BluetoothManager.EVENT_DEVICE_FOUND, (rsp) => {
                    setFoundDevices(rsp);
                }),
            );
            _listeners.push(
                DeviceEventEmitter.addListener(BluetoothManager.EVENT_UNABLE_CONNECT, () => {
                    ToastAndroid.show('Lost connect with device', ToastAndroid.LONG);
                }),
            );
            _listeners.push(
                DeviceEventEmitter.addListener(BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT, () => {
                    ToastAndroid.show('Device Not Support Bluetooth !', ToastAndroid.LONG);
                }),
            );
        }

        onScanDevices();

        return () => {
            for (let i = 0; i < _listeners.length; ++i) {
                _listeners[i].remove();
            }
        };
    }, [setPairedDevices, setFoundDevices, onScanDevices]);

    const onPressDevices = React.useCallback(
        (device: Device, section: number) => {
            setState((prevState) => ({ ...prevState, isConnecting: true }));
            const text = section === 1 ? t('disconnected') : section === 2 ? t('connected') : t('paired');
            BluetoothManager.connect(device.address)
                .then(() => {
                    Toast.show(text, {
                        position: Toast.positions.CENTER,
                        duration: TOAST_DURATION,
                    });
                    let connectedDevice = state.connectedDevice;
                    if (section === 1) {
                        connectedDevice = undefined;
                        asyncStorage.removeItem();
                    } else {
                        connectedDevice = device;
                        asyncStorage.setItem(JSON.stringify(device));
                    }
                    setState((prevState) => ({ ...prevState, connectedDevice: connectedDevice, isConnecting: false }));
                })
                .catch((e) => {
                    Toast.show(e.message, {
                        position: Toast.positions.CENTER,
                        duration: TOAST_DURATION,
                    });
                    setState((prevState) => ({ ...prevState, isConnecting: false }));
                });
            return;
        },
        [asyncStorage, state.connectedDevice, t],
    );

    const renderItem = React.useCallback(
        ({
            item,
            section,
        }: {
            item: Device;
            section: SectionListData<Device, { id: number; title: string; data: Device[] }>;
        }) => (
            <TouchableWithoutFeedback disabled={state.isConnecting} onPress={() => onPressDevices(item, section.id)}>
                <View
                    style={{
                        flexDirection: 'row',
                        height: 50,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    <Text>{item.name || t('unknown')}</Text>
                    <Text>{item.address}</Text>
                </View>
            </TouchableWithoutFeedback>
        ),
        [onPressDevices, state.isConnecting, t],
    );

    const renderSection = React.useCallback(
        ({ section }: { section: SectionListData<Device, { id: number; title: string; data: Device[] }> }) => {
            if (section.data.length === 0) {
                return (
                    <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>{t('no_devices')}</Text>
                    </View>
                );
            }
            return null;
        },
        [t],
    );

    const data = React.useMemo(
        () => [
            { id: 1, title: t('connected_device'), data: state.connectedDevice ? [state.connectedDevice] : [] },
            { id: 2, title: t('paired_devices'), data: state.pairedDevices },
            { id: 3, title: t('found_devices'), data: state.foundDevices },
        ],
        [state.connectedDevice, state.foundDevices, state.pairedDevices, t],
    );

    return (
        <React.Fragment>
            <SectionList
                refreshing={state.isLoading || state.isConnecting}
                onRefresh={onScanDevices}
                sections={data}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={renderItem}
                renderSectionFooter={renderSection}
                renderSectionHeader={({ section: { title } }) => (
                    <View
                        style={{
                            backgroundColor: colors.card,
                            height: 50,
                            justifyContent: 'center',
                            paddingHorizontal: 20,
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
                    </View>
                )}
            />
            <View
                collapsable={false}
                ref={viewRef}
                style={{
                    position: 'absolute',
                    left: 10000,
                    width: 500,
                    padding: 20,
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                }}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: 250 }}>
                        <RNText style={{ marginBottom: 20, fontSize: 16, fontWeight: 'bold' }}>
                            Delivery Information:
                        </RNText>
                        <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>Name: {deliveryInformation.name}</RNText>
                        {deliveryInformation.address && (
                            <RNText style={{ paddingVertical: 2, fontSize: 16, fontWeight: 'bold' }}>
                                {deliveryInformation.address}
                            </RNText>
                        )}
                        {deliveryInformation.complementaryAddress && (
                            <RNText style={{ paddingVertical: 2, fontSize: 16, fontWeight: 'bold' }}>
                                {deliveryInformation.complementaryAddress}
                            </RNText>
                        )}
                        {(deliveryInformation.zipCode || deliveryInformation.city?.id) && (
                            <View style={{ flexDirection: 'row' }}>
                                {deliveryInformation.zipCode && (
                                    <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        {deliveryInformation.zipCode}
                                    </RNText>
                                )}
                                {deliveryInformation.city?.id && (
                                    <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>
                                        {deliveryInformation.city?.name}
                                    </RNText>
                                )}
                            </View>
                        )}
                        <RNText style={{ paddingVertical: 2, fontSize: 16, fontWeight: 'bold' }}>Contacts:</RNText>
                        {deliveryInformation.contacts.map((contact) => (
                            <View style={{ flexDirection: 'row' }} key={`delivery-contact-info-${contact.id}`}>
                                <MaterialIcons
                                    name={contact.type.id === 1 ? 'local-phone' : 'alternate-email'}
                                    size={30}
                                />
                                <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>{contact.value}</RNText>
                            </View>
                        ))}
                    </View>
                    <View style={{ width: 250 }}>
                        <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>Note :</RNText>
                        <RNText style={{ fontSize: 16, fontWeight: 'bold' }}>{deliveryInformation.note}</RNText>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 20 }}>
                    <View style={{ width: 250 }}>
                        <RNText style={{ paddingVertical: 2, fontSize: 16, fontWeight: 'bold' }}>
                            Sender: {order.store.name}
                        </RNText>
                        <RNText style={{ paddingVertical: 2, fontSize: 16, fontWeight: 'bold' }}>
                            Date: {format(new Date(order.createdAt), DISPLAY_DATE_FORMAT)}
                        </RNText>
                    </View>
                    <View style={{ width: 250, paddingLeft: 30 }}>
                        <QRCode size={125} value={order.invoiceToken} />
                    </View>
                </View>
            </View>
        </React.Fragment>
    );
};

export default Printer;
