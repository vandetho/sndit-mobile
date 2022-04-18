import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import axios from 'axios';

interface TakePackageButtonProps {
    item: Package;
}

const TakePackageButtonComponent: React.FunctionComponent<TakePackageButtonProps> = ({ item }) => {
    const { t, i18n } = useTranslation();
    const onPressTakePackage = React.useCallback(async () => {
        try {
            const { data } = axios.get();
        } catch (e) {
            if (e.response) {
                const { response } = e;
            }
        }
    }, []);
    return (
        <Button
            label={t('take_package')}
            type="warning"
            style={{ marginHorizontal: 10, borderRadius: 15 }}
            onPress={onPressTakePackage}
        />
    );
};

const TakePackageButton = React.memo(TakePackageButtonComponent);

export default TakePackageButton;
