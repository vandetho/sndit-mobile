import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePackage } from '@contexts';
import { BarLoader, NewPackageCard, PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Company, Package } from '@interfaces';
import { HEADER_HEIGHT } from '../CompanyDetail';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { useCompanyPackagesFetcher } from '@fetchers';

let onEndReachedCalledDuringMomentum = true;

type CompanyScreenNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'Package'>;

interface PackageListProps {
    company: Company;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onPressNewPackage: () => void;
}

const PackageListComponent: React.FunctionComponent<PackageListProps> = ({ company, onScroll, onPressNewPackage }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<CompanyScreenNavigationProp>();

    const { onSelect } = usePackage();
    const { fetch, fetchMore, packages, isLoading, isLoadingMore } = useCompanyPackagesFetcher();

    const onFetch = React.useCallback(async () => {
        if (company) {
            await fetch(company);
        }
    }, [company, fetch]);

    React.useEffect(() => {
        (async () => await onFetch())();
    }, [onFetch]);

    const data = React.useMemo<Array<Package>>(
        () => [{ id: 0, name: t('new_package'), token: '', roles: [] }, ...packages],
        [packages, t],
    );
    const onPress = React.useCallback(
        (item: Package) => {
            onSelect(item);
            navigation.navigate('Package');
        },
        [navigation, onSelect],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Package }) => {
            if (item.id === 0) {
                return <NewPackageCard item={item} onPressNewPackage={onPressNewPackage} />;
            }
            return <PackageCard item={item} onPress={onPress} />;
        },
        [onPress, onPressNewPackage],
    );

    const keyExtractor = React.useCallback((_, index: number) => `company-packages-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    const renderFooter = React.useCallback(
        () =>
            isLoadingMore && (
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <BarLoader />
                </View>
            ),
        [isLoadingMore],
    );

    const handleFetchMore = React.useCallback(() => {
        if (company && onEndReachedCalledDuringMomentum) {
            (async () => await fetchMore(company))();
        }
    }, [company, fetchMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <Animated.FlatList
            refreshing={isLoading}
            onRefresh={onFetch}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            onScroll={onScroll}
            ListFooterComponent={renderFooter}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={16}
            onMomentumScrollBegin={onMomentumScrollBegin}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT,
                paddingHorizontal: 10,
                paddingBottom: 75,
            }}
        />
    );
};

const PackageList = React.memo(PackageListComponent);

export default PackageList;
