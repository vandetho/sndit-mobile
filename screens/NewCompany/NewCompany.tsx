import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, Header, TextField } from '@components';
import { useTranslation } from 'react-i18next';
import { useNavigation, useTheme } from '@react-navigation/native';
import { axios, showToast } from '@utils';
import { useCompany } from '@contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompanyStackParamList } from '@navigations/CompanyNavigator';

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

type CompanyScreenNavigationProp = StackNavigationProp<CompanyStackParamList, 'Company'>;

interface NewCompanyProps {}

const NewCompany = React.memo<NewCompanyProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { onSelect } = useCompany();
    const navigation = useNavigation<CompanyScreenNavigationProp>();
    const [state, setState] = React.useState({ name: '', dispatch: false });

    const onChangeText = React.useCallback((value: string, name: string) => {
        setState((prevState) => ({ ...prevState, [name]: value }));
    }, []);

    const onPressSave = React.useCallback(async () => {
        setState((prevState) => ({ ...prevState, dispatch: true }));
        try {
            const { data } = await axios.post('/api/companies', { name: state.name });
            setState((prevState) => ({ ...prevState, dispatch: false }));
            showToast({ type: 'success', text2: data.message });
            onSelect(data.data);
            navigation.navigate('Company');
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
    }, [navigation, onSelect, state.name]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Header goBackTitle={t('close')} goBackIcon="times" />
            </View>
            <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
                <TextField label={t('company_name')} name="name" value={state.name} onChangeText={onChangeText} />
            </View>
            <Button label={t('save')} onPress={onPressSave} style={styles.saveButton} />
        </SafeAreaView>
    );
});

export default NewCompany;
