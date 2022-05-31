import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { FontAwesome5 } from '@expo/vector-icons';

interface PrintButtonProps {
    item: Package;
    onPress?: () => void;
    onDone?: () => void;
}

const PrintButtonComponent: React.FunctionComponent<PrintButtonProps> = ({ item, onPress, onDone }) => {
    const { t } = useTranslation();

    const onPressPrint = React.useCallback(async () => {}, [item.token, onDone, onPress]);

    return (
        <Button
            label={t('print_receipt')}
            type="info"
            endIcon={<FontAwesome5 size={24} name="" />}
            style={{ margin: 10, borderRadius: 15 }}
            onPress={onPressPrint}
        />
    );
};

const PrintButton = React.memo(PrintButtonComponent);

export default PrintButton;
