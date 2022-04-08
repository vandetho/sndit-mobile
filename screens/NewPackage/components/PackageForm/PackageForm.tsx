import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, CityPicker, Header, Text, TextField } from '@components';
import { usePackage } from '@contexts';
import { City, Company } from '@interfaces';
import { axios, showToast } from '@utils';
import { BottomTabStackParamsList } from '@navigations/BottomTabNavigator';

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

type PackageScreenNavigationProp = StackNavigationProp<BottomTabStackParamsList, 'PackageStack'>;

interface PackageFormProps {
    company: Company;
    onBack: () => void;
}

const PackageForm = React.memo<PackageFormProps>(({ company, onBack }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
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
            navigation.navigate('PackageStack', { screen: 'Package' });
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
    }, [company, navigation, onSelect, state.address, state.city, state.name, state.note]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Header goBackTitle={t('back')} onGoBack={onBack} />
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
        </View>
    );
});

export default PackageForm;
