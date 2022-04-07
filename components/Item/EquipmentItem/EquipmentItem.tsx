import React from 'react';
import { Equipment } from '@interfaces';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from '@components/Text';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DISPLAY_DATE_FORMAT } from '@config';

export const ITEM_HEIGHT = 150;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: ITEM_HEIGHT,
        borderRadius: 15,
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
});

interface EquipmentItemProps {
    equipment: Equipment;
    onPress: (equipment: Equipment) => void;
}

const EquipmentItem = React.memo<EquipmentItemProps>(({ equipment, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const handlePress = React.useCallback(() => {
        onPress(equipment);
    }, [equipment, onPress]);

    const renderNextMaintenances = React.useCallback(() => {
        const maintenances = equipment.maintenances.splice(0, 3);
        return maintenances.map((maintenance, index) => (
            <View style={styles.detailContainer} key={`next-maintenance-item-${index}`}>
                <Text>{maintenance.type.name}</Text>
                <Text>{format(new Date(maintenance.nextMaintenance), DISPLAY_DATE_FORMAT)}</Text>
            </View>
        ));
    }, [equipment.maintenances]);

    const renderState = React.useCallback(() => {
        return Object.keys(equipment.marking).map((state) => (
            <Text key={`equipment-${equipment.id}-marking-${state}`}>{t(state)}</Text>
        ));
    }, [equipment.id, equipment.marking, t]);

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={[styles.container, { backgroundColor: colors.card }]}>
                <Text bold fontSize={16}>
                    {equipment.code}
                </Text>
                <View style={styles.detailContainer}>{renderState()}</View>
                <Text>{t('next_maintenance')}:</Text>
                {renderNextMaintenances()}
            </View>
        </TouchableWithoutFeedback>
    );
});

export default EquipmentItem;
