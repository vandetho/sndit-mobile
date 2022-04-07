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
import { EquipmentBrand, EquipmentMaintenanceType, ResponseSuccess } from '@interfaces';
import { axios, showToast } from '@utils';
import { useTheme } from '@react-navigation/native';
import { BarLoader } from '@components/Loader';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

interface NewBrandModalProps {
    brand?: EquipmentBrand;
    visible: boolean;
    onClose: () => void;
    onSubmit: (brand: EquipmentBrand) => void;
}

const NewBrandModal = React.memo<NewBrandModalProps>(({ brand, visible, onClose, onSubmit }) => {
    const { height, width } = useWindowDimensions();
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [state, setState] = React.useState<{ name: string; isLoading: boolean }>({
        isLoading: false,
        name: '',
    });

    React.useEffect(() => {
        if (visible) {
            setState((prevState) => ({ ...prevState, name: brand?.name || '' }));
        }
    }, [brand?.name, visible]);

    const onChangeText = React.useCallback((text: string, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: name === 'code' ? text.toUpperCase() : text }));
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
            } = await (brand
                ? axios.put<ResponseSuccess<EquipmentMaintenanceType>>(`/api/equipments/brands/${brand.id}`, {
                      name: state.name,
                  })
                : axios.post<ResponseSuccess<EquipmentMaintenanceType>>(`/api/equipments/brands`, {
                      name: state.name,
                  }));
            onSubmit(data);
            showToast(message);
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
    }, [brand, onSubmit, state.name, t]);

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
                        <Text style={{ marginVertical: 10 }}>{t('new_equipment_brand')}</Text>
                        <TextField name="name" label={t('name')} value={state.name} onChangeText={onChangeText} />
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

export default NewBrandModal;
