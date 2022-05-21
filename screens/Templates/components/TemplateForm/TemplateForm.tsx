import React from 'react';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { City, Company, Template } from '@interfaces';
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, CityPicker, GradientIcon, Text, TextField } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { axios, showToast } from '@utils';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    formContainer: {
        padding: 10,
        margin: 10,
        borderRadius: 15,
    },
    saveButton: {
        marginHorizontal: 10,
        borderRadius: 15,
    },
});

interface TemplateFormProps {
    company: Company;
    template: Template;
    visible: boolean;
    onSave: () => void;
    onClose: () => void;
}

const TemplateForm = React.memo<TemplateFormProps>(({ company, visible, template, onSave, onClose }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const [state, setState] = React.useState<{
        name: string;
        phoneNumber: string;
        address: string;
        city: City | undefined;
        dispatch: boolean;
    }>({ address: '', city: undefined, dispatch: false, name: '', phoneNumber: '' });

    React.useEffect(() => {
        setState((prevState) => {
            if (template) {
                return {
                    ...prevState,
                    address: template.address,
                    city: template.city,
                    name: template.name,
                    phoneNumber: template.phoneNumber,
                };
            }
            return { ...prevState, address: '', city: undefined, dispatch: false, name: '', phoneNumber: '' };
        });
    }, [template]);

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.close();
        }
    }, [visible]);

    const snapPoints = React.useMemo(() => ['65%', '90%'], []);

    const onChangeText = React.useCallback((value: string, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const onChangeCity = React.useCallback((value: City) => {
        setState((prevState) => ({ ...prevState, city: value }));
    }, []);

    const onPressSave = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: true }));
        try {
            const formData: { [key: string]: any } = {};
            formData.name = state.name;
            if (company) {
                formData.company = company.id;
            }
            if (state.phoneNumber) {
                formData.phoneNumber = state.phoneNumber;
            }
            if (state.address) {
                formData.address = state.address;
            }
            if (state.city) {
                formData.city = state.city.id;
            }

            const {
                data: { message },
            } = template
                ? await axios.put(`/api/templates/${template.id}`, formData)
                : await axios.post('/api/templates', formData);
            setState((prevState) => ({ ...prevState, dispatch: false }));
            showToast({ type: 'success', text2: message });
            onSave();
        } catch (e) {
            if (e.response) {
                const {
                    data: { message, detail },
                } = e.response;
                showToast({ type: 'error', text2: message || detail });
            }
            console.error(e);
            setState((prevState) => ({ ...prevState, dispatch: false }));
        }
    }, [company, onSave, state.address, state.city, state.name, state.phoneNumber, template]);

    const handleClose = React.useCallback(() => {
        Keyboard.dismiss();
        onClose();
    }, [onClose]);

    return (
        <BottomSheetModal
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: colors.card }}
            handleIndicatorStyle={{ backgroundColor: colors.text }}
            ref={bottomSheetRef}
            onDismiss={onClose}
        >
            <TouchableOpacity
                onPress={handleClose}
                style={{
                    marginRight: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    height: 40,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    backgroundColor: colors.card,
                }}
            >
                <Text style={{ marginRight: 10 }}>{t('close')}</Text>
                <GradientIcon name="times" />
            </TouchableOpacity>
            <BottomSheetScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
                    <TextField label={t('name')} name="name" value={state.name} onChangeText={onChangeText} />
                    <TextField
                        label={t('phone_number')}
                        name="phoneNumber"
                        value={state.phoneNumber}
                        onChangeText={onChangeText}
                    />
                    <TextField label={t('address')} name="address" value={state.address} onChangeText={onChangeText} />
                    <CityPicker selected={state.city} onValueChange={onChangeCity} />
                </View>
                <Button
                    isLoading={state.dispatch}
                    label={t('save')}
                    endIcon={<FontAwesome5 name="save" color="#FFFFFF" size={20} />}
                    onPress={onPressSave}
                    style={styles.saveButton}
                />
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
});

export default TemplateForm;
