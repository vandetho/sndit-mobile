import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useCompany, useEmployee } from '@contexts';
import { EMPLOYEE_ITEM_HEIGHT, EmployeeCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Employee, ResponseSuccess } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';
import { useVisible } from '@hooks';
import { axios, showToast } from '@utils';
import { AxiosResponse } from 'axios';
import { RolePicker } from './components';
import { ROLES } from '@config';

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
                    `/api/employees/${employee?.token}/change-roles`,
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
        [employee],
    );

    const onPressEmployee = React.useCallback(
        (employee: Employee) => {
            if (company.roles.includes(ROLES.OWNER) && !employee.roles.includes(ROLES.OWNER)) {
                setEmployee(employee);
                onToggle();
            }
        },
        [company.roles, onToggle],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Employee }) => <EmployeeCard company={company} employee={item} onPress={onPressEmployee} />,
        [company, onPressEmployee],
    );

    const keyExtractor = React.useCallback((_, index: number) => `employees-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: EMPLOYEE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (EMPLOYEE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
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
            <RolePicker onValueChange={onValueChange} visible={visible} />
        </React.Fragment>
    );
};

const EmployeeList = React.memo(EmployeeListComponent);

export default EmployeeList;
