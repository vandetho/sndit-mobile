import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { axios, showToast } from '@utils';
import { ResponseSuccess } from '@interfaces';
import { useAuthentication } from '@contexts';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface DeleteAccountProps {}

const DeleteAccountComponent: React.FunctionComponent<DeleteAccountProps> = () => {
    const { t } = useTranslation();
    const {
        jwt: { user },
    } = useAuthentication();
    const [isLoading, setLoading] = React.useState(false);

    const onPress = React.useCallback(() => {
        Alert.alert(
            t('confirmation'),
            user.deletedAt ? t('do_you_want_to_undelete_your_account') : t('do_you_want_to_delete_your_account'),
            [
                {
                    text: t('yes'),
                    onPress: () => {
                        setLoading((prevState) => !prevState);
                        const caller = user.deletedAt
                            ? axios.patch('/api/users/current/undelete')
                            : axios.delete<ResponseSuccess>('/api/users/current');
                        caller
                            .then(({ data }) => {
                                setLoading((prevState) => !prevState);
                                showToast({ text2: data.message, type: 'success' });
                            })
                            .catch((reason) => {
                                if (reason.response) {
                                    const { data } = reason.response;
                                    setLoading((prevState) => !prevState);
                                    showToast({ text2: data.message || data.detail, type: 'error' });
                                }
                                console.error(reason);
                            });
                    },
                },
            ],
        );
    }, [t, user.deletedAt]);

    const description = React.useMemo(
        () =>
            user.deletedAt
                ? t('cancel_delete_account_detail', {
                      deletedAt: format(new Date(user.deletedAt), DISPLAY_DATE_FORMAT),
                  })
                : t('delete_account_detail'),
        [t, user.deletedAt],
    );
    const label = React.useMemo(() => (user.deletedAt ? t('cancel') : t('delete_account')), [t, user.deletedAt]);

    return (
        <View style={styles.container}>
            <View>{description}</View>
            <Button
                label={label}
                type="error"
                shape="square"
                startIcon={<FontAwesome5 name="trash" />}
                isLoading={isLoading}
                onPress={onPress}
            />
        </View>
    );
};

const DeleteAccount = React.memo(DeleteAccountComponent);

export default DeleteAccount;
