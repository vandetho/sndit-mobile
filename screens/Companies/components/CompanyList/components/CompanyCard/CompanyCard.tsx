import React from 'react';
import { Company } from '@interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components';

export const CARD_HEIGHT = 75;

interface CompanyCardProps {
    company: Company;
}

const CompanyCardComponent: React.FunctionComponent<CompanyCardProps> = ({ company }) => {
    const { colors } = useTheme();
    return (
        <TouchableWithoutFeedback>
            <View style={{ height: CARD_HEIGHT, borderRadius: 15, backgroundColor: colors.card }}>
                <Text>{company.name}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const CompanyCard = React.memo(CompanyCardComponent);

export default CompanyCard;
