import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { axios, showToast } from '@utils';
import { FontAwesome5 } from '@expo/vector-icons';

interface PrintButtonProps {
    item: Package;
    onPress?: () => void;
    onDone?: () => void;
}

const PrintButtonComponent: React.FunctionComponent<PrintButtonProps> = ({ item, onPress, onDone }) => {
    const { t } = useTranslation();

    const onPressPrint = React.useCallback(async () => {
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
            endIcon={<FontAwesome5 size={24} name="" />}
            style={{ marginHorizontal: 10, borderRadius: 15 }}
            onPress={onPressPrint}
        />
    );
};

const PrintButton = React.memo(PrintButtonComponent);

export default PrintButton;
