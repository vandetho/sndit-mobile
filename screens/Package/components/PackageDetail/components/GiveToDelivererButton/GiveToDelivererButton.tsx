import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import axios from 'axios';
import { useVisible } from '@hooks';
import Modal from 'react-native-modal';

interface GiveToDelivererButtonProps {
    item: Package;
    onPress?: () => void;
}

const GiveToDelivererButtonComponent: React.FunctionComponent<GiveToDelivererButtonProps> = ({ item, onPress }) => {
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible();

    const onSave = React.useCallback(async () => {
        try {
            const { data } = await axios.post(`/api/packages/${item.token}/give-to-deliverer`);
        } catch (e) {
            if (e.response) {
                const { response } = e;
            }
        }
    }, [item.token]);
    return (
        <React.Fragment>
            <Button label={t('give_to_deliverer')} style={{ margin: 10, borderRadius: 15 }} onPress={onToggle} />
        </React.Fragment>
    );
};

const GiveToDelivererButton = React.memo(GiveToDelivererButtonComponent);

export default GiveToDelivererButton;
