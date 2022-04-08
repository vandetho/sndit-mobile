import React from 'react';
import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCompany } from '@contexts';
import { usePackagesFetcher } from '@fetchers';
import { NewPackageCard, PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { CompanyDetail } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface CompanyProps {}

const Company = React.memo<CompanyProps>(() => {
    const { t } = useTranslation();
    const { company } = useCompany();
    const { fetchCompany, companiesPackages, isLoading } = usePackagesFetcher();

    React.useEffect(() => {
        if (company) {
            (async () => await fetchCompany(company))();
        }
    }, [company, fetchCompany]);

    const data = React.useMemo<Array<Package>>(
        () => [{ id: 0, name: t('new_package'), token: '', roles: [] }, ...companiesPackages],
        [companiesPackages, t],
    );
    const renderItem = React.useCallback(({ item }: { item: Package }) => {
        if (item.id) {
            return <NewPackageCard item={item} />;
        }
        return <PackageCard item={item} />;
    }, []);

    const keyExtractor = React.useCallback((_, index: number) => `company-packages-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <SafeAreaView style={styles.container}>
            <CompanyDetail company={company} />
            <FlatList
                refreshing={isLoading}
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
