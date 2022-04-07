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
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { CustomLinearGradient, GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { EquipmentBrand, EquipmentModel, ResponseSuccess } from '@interfaces';
import { axios, showToast } from '@utils';
import { BarLoader } from '@components/Loader';
import { BrandPicker } from '@components/Picker/BrandPicker';
import { TextField } from '@components/TextField';

const styles = StyleSheet.create({
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

interface NewModelModalProps {
    model?: EquipmentModel;
    visible: boolean;
    onClose: () => void;
    onSubmit: (model: EquipmentModel) => void;
}

const NewModelModal = React.memo<NewModelModalProps>(({ model, visible, onClose, onSubmit }) => {
    const { height, width } = useWindowDimensions();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [state, setState] = React.useState<{ name: string; brand: EquipmentBrand | undefined; isLoading: boolean }>({
        isLoading: false,
        name: '',
        brand: undefined,
    });

    React.useEffect(() => {
        if (visible) {
            setState((prevState) => ({ ...prevState, brand: model?.brand, name: model?.name || '' }));
        }
    }, [model, visible]);

    const onChangeValue = React.useCallback((value: any, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const handleSubmit = React.useCallback(async () => {
        if (!state.name) {
            Alert.alert(t('error'), t('name_required'));
            return;
        }
        try {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            const {
                data: { message, data },
            } = await (model
                ? axios.put<ResponseSuccess<EquipmentModel>>(`/api/equipments/models/${model.id}`, {
                      name: state.name,
                      brand: state.brand?.id,
                  })
                : axios.post<ResponseSuccess<EquipmentModel>>(`/api/equipments/models`, {
                      name: state.name,
                      brand: state.brand?.id,
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
    }, [model, onSubmit, state.brand?.id, state.name, t]);

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
                        height: height * 0.6,
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
                        <Text style={{ marginVertical: 10 }}>{t('new_equipment_model')}</Text>
                        <TextField name="name" label={t('name')} value={state.name} onChangeText={onChangeValue} />
                        <View style={{ width: width - 40 }}>
                            <BrandPicker selected={state.brand} onValueChange={onChangeValue} />
                        </View>
                        <TouchableOpacity onPress={handleSubmit}>
                            <CustomLinearGradient
                                style={{
                                    width: width - 40,
                                    height: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    marginVertical: 10,
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

export default NewModelModal;
