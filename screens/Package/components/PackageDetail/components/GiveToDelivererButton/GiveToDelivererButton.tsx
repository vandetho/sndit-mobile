import React from 'react';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Employee, Package, User } from '@interfaces';
import axios from 'axios';
import { useVisible } from '@hooks';
import { EmployeeModal } from './components';

interface GiveToDelivererButtonProps {
    item: Package;
    onPress?: () => void;
}

const GiveToDelivererButtonComponent: React.FunctionComponent<GiveToDelivererButtonProps> = ({ item, onPress }) => {
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible();

    const onSave = React.useCallback(
        async (employee: Employee) => {
            try {
                const { data } = await axios.post(`/api/packages/${item.token}/give-to-deliverer`, {
                    employee: employee.token,
                });
            } catch (e) {
                if (e.response) {
                    const { response } = e;
                }
            }
        },
        [item.token],
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
