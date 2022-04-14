import React from 'react';
import { Employee } from '@interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { getRoleLabel } from '@utils';
import { useTranslation } from 'react-i18next';

export const EMPLOYEE_ITEM_HEIGHT = 100;

interface EmployeeCardProps {
    employee: Employee;
    onPress?: (employee: Employee) => void;
}

const EmployeeCard = React.memo<EmployeeCardProps>(({ employee, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const handlePres = React.useCallback(() => {
        if (onPress) {
            onPress(employee);
        }
    }, [employee, onPress]);

    return (
        <TouchableWithoutFeedback onPress={handlePres}>
            <View
                style={{
                    height: EMPLOYEE_ITEM_HEIGHT,
                    borderRadius: 15,
                    padding: 10,
                    backgroundColor: colors.card,
                }}
            >
                <Text fontSize={16}>
                    {employee.firstName} {employee.lastName}
                </Text>
                <Text disabled>{t(getRoleLabel(employee.roles))}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default EmployeeCard;
