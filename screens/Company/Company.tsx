import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useCompany } from '@contexts';
import { CompanyDetail } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface CompanyProps {}

const Company = React.memo<CompanyProps>(() => {
    const { company } = useCompany();
    return (
        <SafeAreaView style={styles.container}>
            <CompanyDetail company={company} />
        </SafeAreaView>
    );
});

export default Company;
