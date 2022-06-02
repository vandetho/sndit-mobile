import React from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, CityPicker, Header, Switch, Text, TextField } from '@components';
import { usePackage } from '@contexts';
import { City, Company, Template } from '@interfaces';
import { axios, showToast } from '@utils';
import { ApplicationStackParamsList } from '@navigations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Templates } from './components';
import { useVisible } from '@hooks';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        padding: 10,
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

type PackageScreenNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'Package'>;

interface PackageFormProps {
    company: Company;
    onBack: () => void;
}

const PackageForm = React.memo<PackageFormProps>(({ company, onBack }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { onSelect, onAddPackage } = usePackage();
    const { visible, onToggle, onClose } = useVisible();
    const navigation = useNavigation<PackageScreenNavigationProp>();
    const [state, setState] = React.useState<{
        name: string;
        phoneNumber: string;
        address: string;
        note: string;
        city: City;
        image: string | undefined;
        createTemplate: boolean;
        dispatch: boolean;
    }>({
        name: '',
        phoneNumber: '',
        address: '',
        note: '',
        image: '',
        city: undefined,
        createTemplate: false,
        dispatch: false,
    });

    const onPressTemplate = React.useCallback(
        (template: Template) => {
            setState((prevState) => ({
                ...prevState,
                name: template.name,
                phoneNumber: template.phoneNumber,
                address: template.address,
                city: template.city,
            }));
            onClose();
        },
        [onClose],
    );

    const onChangeText = React.useCallback((value: string, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const onChangeNote = React.useCallback((value: string) => {
        setState((prevState) => ({ ...prevState, note: value }));
    }, []);

    const onSwitch = React.useCallback((checked: boolean) => {
        setState((prevState) => ({ ...prevState, createTemplate: checked }));
    }, []);

    const onChangeCity = React.useCallback((value: City) => {
        setState((prevState) => ({ ...prevState, city: value }));
    }, []);

    const onPressSave = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: true }));
        try {
            const formData: { [key: string]: any } = {};
            formData.name = state.name;
            formData.company = company?.id;
            formData.createTemplate = state.createTemplate;
            if (state.phoneNumber) {
                formData.phoneNumber = state.phoneNumber;
            }
            if (state.address) {
                formData.address = state.address;
            }
            if (state.note) {
                formData.note = state.note;
            }
            if (state.city) {
                formData.city = state.city.id;
            }
            const {
                data: { data },
            } = await axios.post('/api/packages', formData);
            setState((prevState) => ({ ...prevState, dispatch: false }));
            onSelect(data);
            onAddPackage(data);
            navigation.replace('Package');
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
    }, [
        company?.id,
        navigation,
        onAddPackage,
        onSelect,
        state.address,
        state.city,
        state.createTemplate,
        state.name,
        state.note,
        state.phoneNumber,
    ]);

    const onShowTemplates = React.useCallback(() => {
        onToggle();
        Keyboard.dismiss();
    }, [onToggle]);

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <Header
                            goBackTitle={t('back')}
                            onGoBack={onBack}
                            onRightButtonPress={onShowTemplates}
                            headerRightIcon="file-alt"
                            headerRightTitle={t('templates')}
                        />
                    </View>
                    <KeyboardAwareScrollView>
                        <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
                            <TextField label={t('name')} name="name" value={state.name} onChangeText={onChangeText} />
                            <TextField
                                label={t('phone_number')}
                                name="phoneNumber"
                                value={state.phoneNumber}
                                onChangeText={onChangeText}
                            />
                            <TextField
                                label={t('address')}
                                name="address"
                                value={state.address}
                                onChangeText={onChangeText}
                            />
                            <CityPicker selected={state.city} onValueChange={onChangeCity} />
                            <View>
                                <Text>{t('note')}</Text>
                                <TextInput
                                    value={state.note}
                                    multiline
                                    onChangeText={onChangeNote}
                                    style={{
                                        minHeight: 100,
                                        borderBottomWidth: 1,
                                        color: colors.text,
                                        borderBottomColor: colors.text,
                                    }}
                                />
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 10,
                            }}
                        >
                            <Text>{t('create_template')}</Text>
                            <Switch value={state.createTemplate} onValueChange={onSwitch} />
                        </View>
                        <Button
                            isLoading={state.dispatch}
                            label={t('save')}
                            endIcon={<FontAwesome5 name="save" color="#FFFFFF" size={20} />}
                            onPress={onPressSave}
                            style={styles.saveButton}
                        />
                    </KeyboardAwareScrollView>
                </View>
            </TouchableWithoutFeedback>
            <Templates company={company} visible={visible} onPress={onPressTemplate} onClose={onClose} />
        </React.Fragment>
    );
});

export default PackageForm;
