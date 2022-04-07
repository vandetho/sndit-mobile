import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { usePackage } from '@contexts';
import { axios, showToast } from '@utils';
import { Button, CityPicker, Header, TextField } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { PackageStackParamList } from '@navigations/PackageNavigator';
import { City } from '@interfaces';

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
    },
});

type PackageScreenNavigationProp = StackNavigationProp<PackageStackParamList, 'Package'>;

interface NewPackageProps {}

const NewPackage = React.memo<NewPackageProps>(() => {
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
            const formData = new FormData();
            formData.append('name', state.name);
            if (state.address) {
                formData.append('address', state.address);
            }
            if (state.note) {
                formData.append('note', state.note);
            }
            if (state.city) {
                formData.append('city', String(state.city.id));
            }
            if (state.image) {
                formData.append('images[0][imageFile]', state.image);
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
    }, [navigation, onSelect, state.address, state.city, state.image, state.name, state.note]);

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
                    <TextInput value={state.note} onChangeText={onChangeNote} />
                </View>
            </View>
            <Button label={t('save')} onPress={onPressSave} style={styles.saveButton} />
        </SafeAreaView>
    );
});

export default NewPackage;
