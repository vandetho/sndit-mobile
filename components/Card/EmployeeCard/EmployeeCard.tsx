import React from 'react';
import { Company, Employee } from '@interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { axios, getRoleLabel, showToast } from '@utils';
import { useTranslation } from 'react-i18next';
import { Switch } from '@components/Switch';
import { EMPLOYEE } from '@workflows';
import { ROLES } from '@config';
import { BarLoader } from '@components/Loader';

export const EMPLOYEE_ITEM_HEIGHT = 75;

interface EmployeeCardProps {
    company: Company;
    employee: Employee;
    onPress?: (employee: Employee) => void;
}

const EmployeeCard = React.memo<EmployeeCardProps>(({ company, employee, onPress }) => {
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
                const { data } = await axios.post(`/api/employees/${employee.token}/status`, {
                    status,
                });
                setState((prevState) => ({
                    ...prevState,
                    dispatch: false,
                    employee: { ...prevState.employee, marking: { [status]: 1 } },
                }));
                showToast({ type: 'success', text2: data.message });
            } catch (error) {
                setState((prevState) => ({ ...prevState, dispatch: false }));
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

    const renderSwitch = React.useCallback(() => {
        if (company.roles.includes(ROLES.OWNER)) {
            if (state.dispatch) {
                return <BarLoader />;
            }
            return <Switch value={!!employee.marking[EMPLOYEE.ACTIVE]} onValueChange={onSwitch} />;
        }
        return null;
    }, [company.roles, employee.marking, onSwitch, state.dispatch]);

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
