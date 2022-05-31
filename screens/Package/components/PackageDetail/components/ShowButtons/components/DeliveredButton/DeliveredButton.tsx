import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { axios, showToast } from '@utils';
import { useMap } from '@contexts';

interface DeliveredButtonProps {
    item: Package;
    onPress?: () => void;
    onDone?: () => void;
}

const DeliveredButtonComponent: React.FunctionComponent<DeliveredButtonProps> = ({ item, onPress, onDone }) => {
    const { t } = useTranslation();
    const { region } = useMap();
    const onPressDeliver = React.useCallback(async () => {
        if (onPress) {
            onPress();
        }
        try {
            const { data } = await axios.post(`/api/packages/${item.token}/delivered`, {
                latitude: region.latitude,
                longitude: region.longitude,
            });
            showToast({ type: 'success', text2: data.message });
        } catch (e) {
            if (e.response) {
                const {
                    response: { data },
                } = e;
                showToast({ type: 'error', text2: data.message || data.detail });
            }
        }
        if (onDone) {
            onDone();
        }
    }, [item.token, onDone, onPress, region.latitude, region.longitude]);

    return <Button label={t('delivered')} style={{ margin: 10, borderRadius: 15 }} onPress={onPressDeliver} />;
};

const DeliveredButton = React.memo(DeliveredButtonComponent);

export default DeliveredButton;
