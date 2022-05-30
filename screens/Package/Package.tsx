import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BarLoader, HISTORY_ITEM_HEIGHT, HistoryCard } from '@components';
import { PackageHistory } from '@interfaces';
import { usePackage } from '@contexts';
import { usePackageHistoriesFetcher } from '@fetchers';
import { HEADER_HEIGHT, PackageDetail } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

let onEndReachedCalledDuringMomentum = true;

interface PackageProps {}

const Package = React.memo<PackageProps>(() => {
    const { item, onRefreshSelect, fetchPackages } = usePackage();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { histories, isLoading, fetch, fetchMore, isLoadingMore } = usePackageHistoriesFetcher(item);

    React.useEffect(() => {
        if (item) {
            (async () => await fetch())();
        }
    }, [fetch, item]);

    const onDone = React.useCallback(async () => {
        onRefreshSelect();
        fetchPackages();
        await fetch();
    }, [fetch, fetchPackages, onRefreshSelect]);

    const renderItem = React.useCallback(({ item }: { item: PackageHistory }) => <HistoryCard history={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `package-packages-item-${index}`, []);

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
        <View style={styles.container}>
            <PackageDetail item={item} animatedValue={animatedValue} onDone={onDone} />
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
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: HEADER_HEIGHT - 10,
                    paddingBottom: 10,
                    paddingHorizontal: 10,
                }}
            />
        </View>
    );
});

export default Package;
