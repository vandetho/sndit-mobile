import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { HISTORY_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { useEmployee } from '@contexts';
import { useEmployeePackagesFetcher } from '@fetchers';
import { EmployeeDetail, HEADER_HEIGHT } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface EmployeeProps {}

const Employee = React.memo<EmployeeProps>(() => {
    const { employee } = useEmployee();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { packages, fetch, fetchMore, isLoading } = useEmployeePackagesFetcher();

    React.useEffect(() => {
        if (employee) {
            (async () => await fetch(employee))();
        }
    }, [employee, fetch]);

    const renderItem = React.useCallback(({ item }: { item: Package }) => <PackageCard item={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `employee-packages-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: HISTORY_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (HISTORY_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <View style={styles.container}>
            <EmployeeDetail employee={employee} animatedValue={animatedValue} />
            <Animated.FlatList
                refreshing={isLoading}
                data={packages}
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

export default Employee;
