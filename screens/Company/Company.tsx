import React from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useCompany } from '@contexts';
import { CompanyDetail } from './components';
import { usePackagesFetcher } from '@fetchers';
import { Separator } from '@components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface CompanyProps {}

const Company = React.memo<CompanyProps>(() => {
    const { company } = useCompany();
    const { fetchCompany, companiesPackages, isLoading } = usePackagesFetcher();

    const data = React.useMemo(() => [], []);
    const renderItem = React.useMemo(() => [], []);
    const keyExtractor = React.useMemo(() => [], []);
    const getItemLayout = React.useMemo(() => [], []);

    return (
        <SafeAreaView style={styles.container}>
            <CompanyDetail company={company} />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
            />
        </SafeAreaView>
    );
});

export default Company;
