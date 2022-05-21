import React from 'react';
import { Company, Employee, ResponseSuccess } from '@interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { axios, getRoleLabel, showToast } from '@utils';
import { useTranslation } from 'react-i18next';
import { Switch } from '@components/Switch';
import { EMPLOYEE } from '@workflows';
import { ROLES } from '@config';
import { BarLoader } from '@components/Loader';
import { AxiosResponse } from 'axios';

export const EMPLOYEE_ITEM_HEIGHT = 75;

interface EmployeeCardProps {
    index: number;
    company: Company;
    employee: Employee;
    onPress?: (employee: Employee) => void;
    onUpdate?: (employee: Employee, index: number) => void;
}

const EmployeeCard = React.memo<EmployeeCardProps>(({ index, company, employee, onUpdate, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [state, setState] = React.useState({ employee, dispatch: false });

    const handlePres = React.useCallback(() => {
        if (onPress) {
            onPress(employee);
        }
    }, [employee, onPress]);

    const onSwitch = React.useCallback(
        async (checked: boolean) => {
            setState((prevState) => ({ ...prevState, dispatch: true }));
            try {
                const status = checked ? EMPLOYEE.ACTIVE : EMPLOYEE.INACTIVE;
                const {
                    data: { message, data },
                } = await axios.post<{ status: string }, AxiosResponse<ResponseSuccess<Employee>>>(
                    `/api/employees/${employee.token}/status`,
                    {
                        status,
                    },
                );
                setState((prevState) => ({
                    ...prevState,
                    dispatch: false,
                    employee: data,
                }));
                showToast({ type: 'success', text2: message });
                if (onUpdate) {
                    onUpdate(data, index);
                }
            } catch (error) {
                setState((prevState) => ({ ...prevState, dispatch: false }));
                if (!error.response) {
                    console.error(error);
                    return;
                }
                const {
                    response: { data },
                } = error;
                showToast({ type: 'error', text2: data.message || data.detail });
            }
        },
        [employee.token, index, onUpdate],
    );

    const renderSwitch = React.useCallback(() => {
        if (company.roles.includes(ROLES.OWNER) && !employee.roles.includes(ROLES.OWNER)) {
            if (state.dispatch) {
                return <BarLoader />;
            }
            return (
                <Switch
                    labels={[t('inactive'), t('active')]}
                    value={!!employee.marking[EMPLOYEE.ACTIVE]}
                    onValueChange={onSwitch}
                />
            );
        }
        return null;
    }, [company.roles, employee.marking, employee.roles, onSwitch, state.dispatch, t]);

    return (
        <TouchableWithoutFeedback onPress={handlePres}>
            <View
                style={{
                    height: EMPLOYEE_ITEM_HEIGHT,
                    borderRadius: 15,
                    padding: 10,
                    backgroundColor: colors.card,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                <View>
                    <Text fontSize={16}>
                        {employee.firstName} {employee.lastName}
                    </Text>
                    <Text>{t(getRoleLabel(employee.roles))}</Text>
                </View>
                {renderSwitch()}
            </View>
        </TouchableWithoutFeedback>
    );
});

export default EmployeeCard;
