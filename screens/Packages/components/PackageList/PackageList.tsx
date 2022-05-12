import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePackage } from '@contexts';
import { BarLoader, NewPackageCard, PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';

let onEndReachedCalledDuringMomentum = true;

type PackageScreenNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'Package'>;

interface PackageListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onPressNewPackage: () => void;
}

const PackageListComponent: React.FunctionComponent<PackageListProps> = ({ onScroll, onPressNewPackage }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<PackageScreenNavigationProp>();
    const { packages, isLoading, isLoadingMore, fetchMorePackages, fetchPackages, onSelect } = usePackage();

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

    const keyExtractor = React.useCallback((_, index: number) => `packages-item-${index}`, []);

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

    const handleFetchMore = React.useCallback(async () => {
        if (onEndReachedCalledDuringMomentum) {
            await fetchMorePackages();
        }
    }, [fetchMorePackages]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <Animated.FlatList
            onRefresh={fetchPackages}
            refreshing={isLoading}
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
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={onMomentumScrollBegin}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT + 10,
                paddingHorizontal: 10,
                paddingBottom: 75,
            }}
        />
    );
};

const PackageList = React.memo(PackageListComponent);

export default PackageList;
