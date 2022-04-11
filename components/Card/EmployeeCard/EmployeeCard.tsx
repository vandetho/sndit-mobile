import React from 'react';
import { Employee } from '@interfaces';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';

export const EMPLOYEE_ITEM_HEIGHT = 100;

interface EmployeeCardProps {
    employee: Employee;
}

const EmployeeCard = React.memo<EmployeeCardProps>(({ employee }) => {
    const { colors } = useTheme();
    return (
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
        </View>
    );
});

export default EmployeeCard;
