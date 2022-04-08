import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { useCompany } from '@contexts';

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

interface NewPackageProps {}

const NewPackage = React.memo<NewPackageProps>(() => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { company } = useCompany();
    const [state, setState] = React.useState({
        company,
        page: company ? 0 : 1,
    });
});

export default NewPackage;
