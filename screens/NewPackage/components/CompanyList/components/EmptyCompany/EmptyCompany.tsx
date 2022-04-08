import React from 'react';
import { Text } from '@components';
import { useTranslation } from 'react-i18next';

interface EmptyCompanyProps {}

const EmptyCompanyComponent: React.FunctionComponent<EmptyCompanyProps> = () => {
    const { t } = useTranslation();
    return <Text>{t('no_company_found')}</Text>;
};

const EmptyCompany = React.memo(EmptyCompanyComponent);

export default EmptyCompany;
