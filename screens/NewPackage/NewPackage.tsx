import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PackageStackParamList } from '@navigations/PackageNavigator';
import { FontAwesome5 } from '@expo/vector-icons';
import { City } from '@interfaces';
import { axios, showToast } from '@utils';
import { Button, CityPicker, Header, Text, TextField } from '@components';
import { useCompany, usePackage } from '@contexts';

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

type PackageScreenNavigationProp = StackNavigationProp<PackageStackParamList, 'Package'>;

interface NewPackageProps {}

const NewPackage = React.memo<NewPackageProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { company } = useCompany();
    const { onSelect } = usePackage();
    const navigation = useNavigation<PackageScreenNavigationProp>();
    const [state, setState] = React.useState<{
        name: string;
        address: string;
        note: string;
        city: City;
        image: string | undefined;
        dispatch: boolean;
    }>({
        name: '',
        address: '',
        note: '',
        image: '',
        city: undefined,
        dispatch: false,
    });

    const onChangeText = React.useCallback((value: string, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const onChangeNote = React.useCallback((value: string) => {
        setState((prevState) => ({ ...prevState, note: value }));
    }, []);

    const onChangeCity = React.useCallback((value: City) => {
        setState((prevState) => ({ ...prevState, city: value }));
    }, []);

    const onPressSave = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: true }));
        try {
            const formData: { [key: string]: any } = {};
            formData.name = state.name;
            formData.company = company.id;
            if (state.address) {
                formData.address = state.address;
            }
            if (state.note) {
                formData.note = state.note;
            }
            if (state.city) {
                formData.city = state.city.id;
            }
            const { data } = await axios.post('/api/packages', formData);
            setState((prevState) => ({ ...prevState, dispatch: false }));
            onSelect(data.data);
            navigation.navigate('Package');
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
    }, [company.id, navigation, onSelect, state.address, state.city, state.name, state.note]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Header goBackTitle={t('close')} goBackIcon="times" />
            </View>
            <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
                <TextField label={t('name')} name="name" value={state.name} onChangeText={onChangeText} />
                <TextField label={t('address')} name="address" value={state.address} onChangeText={onChangeText} />
                <CityPicker selected={state.city} onValueChange={onChangeCity} />
                <View>
                    <Text>{t('note')}</Text>
                    <TextInput
                        value={state.note}
                        multiline
                        onChangeText={onChangeNote}
                        style={{ minHeight: 100, borderBottomWidth: 1, color: colors.text }}
                    />
                </View>
            </View>
            <Button
                isLoading={state.dispatch}
                label={t('save')}
                endIcon={<FontAwesome5 name="save" color="#FFFFFF" size={20} />}
                onPress={onPressSave}
                style={styles.saveButton}
            />
        </SafeAreaView>
    );
});

export default NewPackage;
