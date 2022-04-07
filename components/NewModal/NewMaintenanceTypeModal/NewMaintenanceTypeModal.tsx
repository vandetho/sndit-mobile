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
import { EquipmentMaintenanceType, EquipmentType, ResponseSuccess } from '@interfaces';
import { axios, showToast } from '@utils';
import { useTheme } from '@react-navigation/native';
import { BarLoader } from '@components/Loader';
import Modal from 'react-native-modal';
import { Switch } from '@components/Switch';
import { TypePicker } from '@components/Picker/TypePicker';

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

interface NewMaintenanceTypeModalProps {
    maintenanceType?: EquipmentMaintenanceType;
    visible: boolean;
    onClose: () => void;
    onSubmit: (type: EquipmentMaintenanceType) => void;
}

const NewMaintenanceTypeModal = React.memo<NewMaintenanceTypeModalProps>(
    ({ maintenanceType, visible, onClose, onSubmit }) => {
        const { height, width } = useWindowDimensions();
        const { t } = useTranslation();
        const { colors } = useTheme();
        const [state, setState] = React.useState<{
            name: string;
            isLoading: boolean;
            needNextDate: boolean;
            usePrevious: boolean;
            numberOfMonth: string;
            equipmentType: EquipmentType | undefined;
        }>({
            isLoading: false,
            name: '',
            numberOfMonth: '',
            usePrevious: false,
            equipmentType: undefined,
            needNextDate: false,
        });

        React.useEffect(() => {
            if (visible) {
                setState((prevState) => ({
                    ...prevState,
                    name: maintenanceType?.name || '',
                    equipmentType: maintenanceType?.equipmentType,
                    needNextDate: maintenanceType?.needNextDate || false,
                }));
            }
        }, [maintenanceType?.equipmentType, maintenanceType?.name, maintenanceType?.needNextDate, visible]);

        const onChangeValue = React.useCallback((value: any, name: string) => {
            setState((prevState) => ({ ...prevState, [name]: value }));
        }, []);

        const onChangeNeedNextDate = React.useCallback((needNextDate: boolean) => {
            setState((prevState) => ({ ...prevState, needNextDate }));
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
                } = await (maintenanceType
                    ? axios.put<ResponseSuccess<EquipmentMaintenanceType>>(
                          `/api/equipments/maintenances/types/${maintenanceType.id}`,
                          {
                              name: state.name,
                              needNextDate: state.needNextDate,
                          },
                      )
                    : axios.post<ResponseSuccess<EquipmentMaintenanceType>>(`/api/equipments/maintenances/types`, {
                          name: state.name,
                          needNextDate: state.needNextDate,
                      }));
                showToast(message);
                onSubmit(data);
                setState((prevState) => ({ ...prevState, isLoading: false }));
            } catch (e) {
                setState((prevState) => ({ ...prevState, isLoading: false }));
                if (e.response) {
                    const {
                        response: { data },
                    } = e;
                    showToast(data.message || data.detail);
                    return;
                }
                console.error(e);
            }
        }, [maintenanceType, onSubmit, state.name, state.needNextDate, t]);

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
                            <Text style={{ marginVertical: 10 }}>{t('new_equipment_maintenance_type')}</Text>
                            <TypePicker
                                withNew
                                name="equipmentType"
                                selected={state.equipmentType}
                                onValueChange={onChangeValue}
                            />
                            <TextField name="name" label={t('name')} value={state.name} onChangeText={onChangeValue} />
                            <View
                                style={{
                                    width: width - 40,
                                    justifyContent: 'space-between',
                                    paddingVertical: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Text>{t('need_next_date')}</Text>
                                <Switch value={state.needNextDate} onValueChange={onChangeNeedNextDate} />
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
    },
);

export default NewMaintenanceTypeModal;
