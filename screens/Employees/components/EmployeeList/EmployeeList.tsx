import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useEmployee } from '@contexts';
import { EmployeeCard, PACKAGE_ITEM_HEIGHT, Separator, SEPARATOR_HEIGHT } from '@components';
import { Employee } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';

interface EmployeeListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const EmployeeListComponent: React.FunctionComponent<EmployeeListProps> = ({ onScroll }) => {
    const { employees, isLoading } = useEmployee();

    const renderItem = React.useCallback(({ item }: { item: Employee }) => <EmployeeCard employee={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `employees-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <Animated.FlatList
            refreshing={isLoading}
            data={employees}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            onScroll={onScroll}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT,
                paddingHorizontal: 10,
            }}
        />
    );
};

const EmployeeList = React.memo(EmployeeListComponent);

export default EmployeeList;
