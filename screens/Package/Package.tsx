import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { BarLoader, HISTORY_ITEM_HEIGHT, HistoryCard } from '@components';
import { PackageHistory } from '@interfaces';
import { usePackage } from '@contexts';
import { usePackageHistoriesFetcher } from '@fetchers';
import { useVisible } from '@hooks';
import { ActionButtons, HEADER_HEIGHT, PackageDetail } from './components';

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
    const [dispatch, setDispatch] = React.useState(false);
    const { visible, onOpen, onClose } = useVisible();

    React.useEffect(() => {
        if (item) {
            (async () => await fetch())();
        }
    }, [fetch, item]);

    const onPress = React.useCallback(() => {
        setDispatch(true);
        onOpen();
    }, [onOpen]);

    const onDone = React.useCallback(async () => {
        onRefreshSelect();
        fetchPackages();
        await fetch();
        setDispatch(false);
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

    const renderLoader = React.useCallback(() => {
        if (dispatch) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 2,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                    }}
                >
                    <BarLoader />
                </View>
            );
        }
        return null;
    }, [dispatch]);

    const Separator = React.useCallback(() => <View style={{ height: 5 }} />, []);

    return (
        <View style={styles.container}>
            <PackageDetail item={item} animatedValue={animatedValue} onShowButton={onOpen} />
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
            <ActionButtons item={item} visible={visible} onPress={onPress} onDone={onDone} onClose={onClose} />
            {renderLoader()}
        </View>
    );
});

export default Package;
