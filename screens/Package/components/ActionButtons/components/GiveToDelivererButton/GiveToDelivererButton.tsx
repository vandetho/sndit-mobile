import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Employee, Package } from '@interfaces';
import { useVisible } from '@hooks';
import { EmployeeModal } from './components';
import { axios, showToast } from '@utils';

interface GiveToDelivererButtonProps {
    item: Package;
    onPress?: () => void;
    onDone?: () => void;
}

const GiveToDelivererButtonComponent: React.FunctionComponent<GiveToDelivererButtonProps> = ({
    item,
    onPress,
    onDone,
}) => {
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible();

    const onSave = React.useCallback(
        async (employee: Employee) => {
            if (onPress) {
                onPress();
            }
            try {
                const { data } = await axios.post(`/api/packages/${item.token}/give-to-deliverer`, {
                    employee: employee.token,
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
        },
        [item.token, onDone, onPress],
    );

    return (
        <React.Fragment>
            <Button label={t('give_to_deliverer')} style={{ margin: 10, borderRadius: 15 }} onPress={onToggle} />
            <EmployeeModal company={item.company} visible={visible} onSave={onSave} onClose={onToggle} />
        </React.Fragment>
    );
};

const GiveToDelivererButton = React.memo(GiveToDelivererButtonComponent);

export default GiveToDelivererButton;
