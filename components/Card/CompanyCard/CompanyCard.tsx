import React from 'react';
import { Company } from '@interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Text } from '@components';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompanyStackParamList } from '@navigations/CompanyNavigator';
import { useCompany } from '@contexts';

export const CARD_HEIGHT = 75;

type CompanyScreenNavigationProp = StackNavigationProp<CompanyStackParamList, 'Company'>;

interface CompanyCardProps {
    company: Company;
}

const CompanyCardComponent: React.FunctionComponent<CompanyCardProps> = ({ company }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { onSelect } = useCompany();
    const navigation = useNavigation<CompanyScreenNavigationProp>();

    const renderRole = React.useCallback(() => {
        if (company.roles.includes('ROLE_OWNER')) {
            return t('owner');
        }
        if (company.roles.includes('ROLE_MANAGER')) {
            return t('manager');
        }
        return t('employee');
    }, [company.roles, t]);

    const onPress = React.useCallback(() => {
        onSelect(company);
        navigation.navigate('Company');
    }, [company, navigation, onSelect]);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={{ height: CARD_HEIGHT, borderRadius: 15, backgroundColor: colors.card, padding: 10 }}>
                <Text bold>{company.name}</Text>
                <Text style={{ marginVertical: 10 }}>{renderRole()}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const CompanyCard = React.memo(CompanyCardComponent);

export default CompanyCard;
