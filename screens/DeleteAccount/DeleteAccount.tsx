import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { axios, showToast } from '@utils';
import { ResponseSuccess } from '@interfaces';

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
    const [isLoading, setLoading] = React.useState(false);

    const onPress = React.useCallback(() => {
        Alert.alert(t('confirmation'), t('do_you_want_to_delete_your_account'), [
            {
                text: t('yes'),
                onPress: () => {
                    setLoading((prevState) => !prevState);
                    axios
                        .delete<ResponseSuccess>('/api/users/current')
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
        ]);
    }, [t]);

    return (
        <View style={styles.container}>
            <View>{t('delete_account_detail')}</View>
            <Button
                label={t('delete_account')}
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
