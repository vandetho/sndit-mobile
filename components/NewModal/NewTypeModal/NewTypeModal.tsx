import React from 'react';
import {
    Alert,
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from 'react-native';
import { TextField } from '@components/TextField';
import { useTranslation } from 'react-i18next';
import { CustomLinearGradient, GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { EquipmentType, ResponseSuccess } from '@interfaces';
import { axios, showToast } from '@utils';
import { useTheme } from '@react-navigation/native';
import { BarLoader } from '@components/Loader';
import Modal from 'react-native-modal';
import { Switch } from '@components/Switch';

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

interface NewTypeModalProps {
    type?: EquipmentType;
    visible: boolean;
    onClose: () => void;
    onSubmit: (type: EquipmentType) => void;
}

const NewTypeModal = React.memo<NewTypeModalProps>(({ type, visible, onClose, onSubmit }) => {
    const { height, width } = useWindowDimensions();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [state, setState] = React.useState<{
        name: string;
        code: string;
        isLoading: boolean;
        useGas: boolean;
    }>({
        isLoading: false,
        code: '',
        name: '',
        useGas: false,
    });

    React.useEffect(() => {
        if (visible) {
            setState((prevState) => ({
                ...prevState,
                code: type?.code || '',
                name: type?.name || '',
                useGas: type?.useGas || false,
            }));
        }
    }, [type?.code, type?.name, type?.useGas, visible]);

    const onChangeText = React.useCallback((text: string, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: name === 'code' ? text.toUpperCase() : text }));
    }, []);

    const onChangeUseGas = React.useCallback((useGas: boolean) => {
        setState((prevState) => ({ ...prevState, useGas }));
    }, []);

    const handleSubmit = React.useCallback(async () => {
        if (!state.name) {
            Alert.alert(t('error'), t('name_required'));
            return;
        }
        if (!state.code) {
            Alert.alert(t('error'), t('code_required'));
            return;
        }
        try {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            const {
                data: { message, data },
            } = await (type
                ? axios.put<ResponseSuccess<EquipmentType>>(`/api/equipments/types/${type.id}`, {
                      name: state.name,
                      code: state.code,
                      useGas: state.useGas,
                  })
                : axios.post<ResponseSuccess<EquipmentType>>(`/api/equipments/types`, {
                      name: state.name,
                      code: state.code,
                      useGas: state.useGas,
                  }));
            showToast(message);
            onSubmit(data);
        } catch (e) {
            if (e.response) {
                const {
                    response: { data },
                } = e;
                showToast(data.message || data.detail);
                setState((prevState) => ({ ...prevState, isLoading: false }));
                return;
            }
            console.error(e);
        }
        setState((prevState) => ({ ...prevState, isLoading: false }));
    }, [onSubmit, state.code, state.name, state.useGas, t, type]);

    return (
        <Modal
            isVisible={visible}
            swipeDirection={['down']}
            onSwipeComplete={onClose}
            onBackdropPress={Keyboard.dismiss}
            style={{
                margin: 0,
                justifyContent: 'flex-end',
            }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        height: height * 0.75,
                        backgroundColor: colors.card,
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            height: 40,
                            backgroundColor: colors.background,
                            marginVertical: 10,
                            borderRadius: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'flex-end',
                            marginRight: 20,
                            paddingHorizontal: 10,
                            flexDirection: 'row',
                        }}
                    >
                        <GradientIcon name="times" />
                        <Text style={{ marginLeft: 10 }}>{t('close')}</Text>
                    </TouchableOpacity>
                    <View style={styles.contentContainer}>
                        <Text style={{ marginVertical: 10 }}>{t('new_equipment_type')}</Text>
                        <TextField name="name" label={t('name')} value={state.name} onChangeText={onChangeText} />
                        <TextField
                            name="code"
                            label={t('code')}
                            value={state.code}
                            autoCapitalize="characters"
                            onChangeText={onChangeText}
                        />
                        <View
                            style={{
                                width: width - 40,
                                justifyContent: 'space-between',
                                paddingVertical: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text>{t('use_gas')}</Text>
                            <Switch value={state.useGas} onValueChange={onChangeUseGas} />
                        </View>
                        <TouchableOpacity onPress={handleSubmit}>
                            <CustomLinearGradient
                                style={{
                                    width: width - 40,
                                    height: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                }}
                            >
                                {state.isLoading ? <BarLoader /> : <Text>{t('save')}</Text>}
                            </CustomLinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

export default NewTypeModal;
