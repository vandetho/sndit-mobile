import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { HEADER_HEIGHT } from '../PackageDetail';
import { BarLoader, HISTORY_ITEM_HEIGHT, HistoryCard } from '@components';
import { usePackageHistoriesFetcher } from '@fetchers';
import { Package } from '@interfaces';

let onEndReachedCalledDuringMomentum = true;

interface PackageHistoryProps {
    item: Package;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const PackageHistory = React.memo<PackageHistoryProps>(({ item, onScroll }) => {
    const { histories, isLoading, fetch, fetchMore, isLoadingMore } = usePackageHistoriesFetcher(item);

    React.useEffect(() => {
        if (item) {
            (async () => await fetch())();
        }
    }, [fetch, item]);

    const renderItem = React.useCallback(({ item }) => <HistoryCard history={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `package-histories-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: HISTORY_ITEM_HEIGHT + 5,
            offset: (HISTORY_ITEM_HEIGHT + 5) * index,
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
            await fetchMore();
        }
    }, [fetchMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    const Separator = React.useCallback(() => <View style={{ height: 5 }} />, []);
    return (
        <Animated.FlatList
            onRefresh={fetch}
            refreshing={isLoading}
            data={histories}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            ListFooterComponent={renderFooter}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={16}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onScroll={onScroll}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT - 10,
                paddingBottom: 10,
                paddingHorizontal: 10,
            }}
        />
    );
});

export default PackageHistory;
