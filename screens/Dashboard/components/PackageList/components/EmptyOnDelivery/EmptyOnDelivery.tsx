import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@components';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface EmptyOnDeliveryProps {}

const EmptyOnDelivery = React.memo<EmptyOnDeliveryProps>(() => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>{t('no_on_delivery_package')}</Text>
        </View>
    );
});

export default EmptyOnDelivery;
