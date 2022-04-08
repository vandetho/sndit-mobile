import React from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { Header, Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import company from '@screens/Company/Company';
import { Company } from '@interfaces';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HEADER_HEIGHT = 200;

const styles = StyleSheet.create({
    container: {
        height: HEADER_HEIGHT,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
});

interface CompanyDetailProps {
    company: Company;
}

const CompanyDetailComponent: React.FunctionComponent<CompanyDetailProps> = ({ company }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const renderRole = React.useCallback(() => {
        if (company.roles.includes('ROLE_OWNER')) {
            return t('owner');
        }
        if (company.roles.includes('ROLE_MANAGER')) {
            return t('manager');
        }
        return t('employee');
    }, [company.roles, t]);

    return (
        <Animated.View style={[styles.container]}>
            <Header
                goBackTitle={t('back')}
                containerStyle={{ marginTop: insets.top, marginHorizontal: 10, marginBottom: 10 }}
            />
            <View style={{ padding: 10, borderRadius: 15, backgroundColor: colors.card, marginHorizontal: 10 }}>
                <Text>{company.name}</Text>
                <Text style={{ marginVertical: 10 }}>{renderRole()}</Text>
            </View>
        </Animated.View>
    );
};

const CompanyDetail = React.memo(CompanyDetailComponent);

export default CompanyDetail;
