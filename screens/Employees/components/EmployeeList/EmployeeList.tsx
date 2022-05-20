import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useCompany, useEmployee } from '@contexts';
import { EMPLOYEE_ITEM_HEIGHT, EmployeeCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Employee, ResponseSuccess } from '@interfaces';
import { useVisible } from '@hooks';
import { axios, showToast } from '@utils';
import { AxiosResponse } from 'axios';
import { ROLES } from '@config';
import { RolePicker } from './components';
import { HEADER_HEIGHT } from '../HeaderSection';

interface EmployeeListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const EmployeeListComponent: React.FunctionComponent<EmployeeListProps> = ({ onScroll }) => {
    const { visible, onToggle } = useVisible();
    const [state, setState] = React.useState<{ employee: Employee; role: string }>({ employee: undefined, role: '' });
    const { employees, isLoading } = useEmployee();
    const { company } = useCompany();

    const onValueChange = React.useCallback(
        async (role: string) => {
            try {
                const { employee } = state;
                const {
                    data: { message, data },
                } = await axios.post<{ role: string }, AxiosResponse<ResponseSuccess<Employee>>>(
                    `/api/employees/${employee?.token}/change-roles`,
                    {
                        role,
                    },
                );
                setState((prevState) => ({ ...prevState, employee: data }));
                showToast({ type: 'success', text2: message });
                onToggle();
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
        [onToggle, state],
    );

    const onPressEmployee = React.useCallback(
        (employee: Employee) => {
            if (company.roles.includes(ROLES.OWNER) && !employee.roles.includes(ROLES.OWNER)) {
                setState((prevState) => ({
                    ...prevState,
                    employee,
                    role: employee.roles.includes(ROLES.MANAGER) ? ROLES.MANAGER : ROLES.EMPLOYEE,
                }));
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
            <RolePicker role={state.role} onValueChange={onValueChange} visible={visible} onClose={onToggle} />
        </React.Fragment>
    );
};

const EmployeeList = React.memo(EmployeeListComponent);

export default EmployeeList;
