import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useCompany, useEmployee } from '@contexts';
import { EmployeeCard, PACKAGE_ITEM_HEIGHT, Separator, SEPARATOR_HEIGHT } from '@components';
import { Employee, ResponseSuccess } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';
import { RolePicker } from '@screens/Employees/components';
import { useVisible } from '@hooks';
import { axios, showToast } from '@utils';
import { AxiosResponse } from 'axios';

interface EmployeeListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const EmployeeListComponent: React.FunctionComponent<EmployeeListProps> = ({ onScroll }) => {
    const { visible, onToggle } = useVisible();
    const [employee, setEmployee] = React.useState<Employee>(undefined);
    const { employees, isLoading } = useEmployee();
    const { company } = useCompany();

    const onValueChange = React.useCallback(
        async (role: string) => {
            try {
                const { data } = await axios.post<{ role: string }, AxiosResponse<ResponseSuccess<any>>>(
                    `/api/employees/${employee.token}/change-roles`,
                    {
                        role,
                    },
                );
                showToast({ type: 'success', text2: data.message });
            } catch (error) {
                if (!error.response) {
                    console.error(error);
                    return;
                }
                const {
                    response: { data },
                } = error;
                showToast({ type: 'success', text2: data.message || data.detail });
            }
        },
        [employee.token],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Employee }) => <EmployeeCard company={company} employee={item} onPress={setEmployee} />,
        [company],
    );

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
        <React.Fragment>
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
            <RolePicker onValueChange={onValueChange} visible={visible} onClose={onToggle} />
        </React.Fragment>
    );
};

const EmployeeList = React.memo(EmployeeListComponent);

export default EmployeeList;
