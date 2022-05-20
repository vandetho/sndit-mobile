import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

interface EmptyTemplateProps {}

const EmptyTemplate = React.memo<EmptyTemplateProps>(() => {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <Text>{t('no_template_found')}</Text>
        </View>
    );
});

export default EmptyTemplate;
