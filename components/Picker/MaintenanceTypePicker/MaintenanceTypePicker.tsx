import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EquipmentMaintenanceType, EquipmentType } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { NewMaintenanceTypeModal } from '@components/NewModal';
import { MaintenanceTypeModal } from './components';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

interface MaintenanceTypePickerProps {
    name?: string;
    equipmentType: EquipmentType | undefined;
    selected: EquipmentMaintenanceType | undefined;
    onValueChange: (type: EquipmentMaintenanceType | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const MaintenanceTypePicker = React.memo<MaintenanceTypePickerProps>(
    ({ name = 'type', equipmentType, selected, style, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();
        const { visible: newVisible, onToggle: onNewToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (type: EquipmentMaintenanceType) => {
                onToggle();
                onValueChange(type, name);
            },
            [onToggle, onValueChange, name],
        );

        const onPressNew = React.useCallback(() => {
            onNewToggle();
        }, [onNewToggle]);

        const onSubmitNew = React.useCallback(
            (type: EquipmentMaintenanceType) => {
                onNewToggle();
                onValueChange(type, name);
            },
            [name, onNewToggle, onValueChange],
        );

        return (
            <React.Fragment>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={onToggle}>
                        <View
                            style={[
                                {
                                    height: 50,
                                    marginVertical: 5,
                                    width: '100%',
                                },
                                style,
                            ]}
                        >
                            <Text style={{ color: colors.text }}>{t('type')}</Text>
                            <View
                                style={{
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <GradientIcon name="map-marker-alt" size={24} />
                                <Text style={{ color: colors.text, marginHorizontal: 10 }}>
                                    {selected?.name || t('select_maintenance_type_placeholder')}
                                </Text>
                                <GradientIcon name="chevron-down" size={24} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={onPressNew}>
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                            }}
                        >
                            <GradientIcon name="plus" size={24} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <MaintenanceTypeModal
                    equipmentType={equipmentType}
                    selected={selected}
                    visible={visible}
                    onChange={handleValueChange}
                    onClose={onToggle}
                />
                <NewMaintenanceTypeModal visible={newVisible} onSubmit={onSubmitNew} onClose={onNewToggle} />
            </React.Fragment>
        );
    },
);

export default MaintenanceTypePicker;
