import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { axios, showToast } from '@utils';

interface TakePackageButtonProps {
    item: Package;
    onPress?: () => void;
    onDone?: () => void;
}

const TakePackageButtonComponent: React.FunctionComponent<TakePackageButtonProps> = ({ item, onPress, onDone }) => {
    const { t } = useTranslation();
    const onPressTakePackage = React.useCallback(async () => {
        if (onPress) {
            onPress();
        }
        try {
            const { data } = await axios.post(`/api/packages/${item.token}/take-package`);
            showToast({ type: 'success', text2: data.message });
        } catch (e) {
            if (e.response) {
                const {
                    response: { data },
                } = e;
                showToast({ type: 'error', text2: data.message || data.detail });
            }
            console.error(e);
        }
        if (onDone) {
            onDone();
        }
    }, [item.token, onDone, onPress]);

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
