import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { Company } from '@interfaces';

export const ITEM_HEIGHT = 50;

interface CompanyItemProps {
    company: Company;
    onPress: (company: Company) => void;
}

const CompanyItem = React.memo<CompanyItemProps>(({ company, onPress }) => {
    const { colors } = useTheme();

    const handlePress = React.useCallback(() => {
        onPress(company);
    }, [company, onPress]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                backgroundColor: colors.background,
                borderRadius: 15,
                height: ITEM_HEIGHT,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>{company.name}</Text>
        </TouchableOpacity>
    );
});

export default CompanyItem;
