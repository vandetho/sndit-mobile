import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { usePackage } from '@contexts';
import { usePackageHistoriesFetcher } from '@fetchers';
import { HEADER_HEIGHT, PackageDetail } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface PackageProps {}

const Package = React.memo<PackageProps>(() => {
    const { item } = usePackage();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { histories, isLoading } = usePackageHistoriesFetcher(item);

    const renderItem = React.useCallback(({ item }: { item: Package }) => <PackageCard item={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `package-packages-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <View style={styles.container}>
            <PackageDetail item={item} animatedValue={animatedValue} />
            <Animated.FlatList
                refreshing={isLoading}
                data={histories}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={{ flexGrow: 1, paddingTop: HEADER_HEIGHT, paddingHorizontal: 10 }}
            />
        </View>
    );
});

export default Package;
