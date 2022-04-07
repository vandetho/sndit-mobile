import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 50,
        borderRadius: 10,
        marginVertical: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {},
});

interface EmptyTeamProps {}

const EmptyTeam = React.memo<EmptyTeamProps>(() => {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text>{t('no_equipment_team')}</Text>
        </View>
    );
});

export default EmptyTeam;
