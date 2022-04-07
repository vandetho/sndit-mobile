import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EquipmentGasCategory } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { GasCategoryModal } from './components';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

interface GasCategoryPickerProps {
    nullable?: boolean;
    name?: string;
    selected: EquipmentGasCategory | undefined;
    onValueChange: (gasCategory: EquipmentGasCategory | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const GasCategoryPicker = React.memo<GasCategoryPickerProps>(
    ({ nullable = false, name = 'gasCategory', selected, style, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (gasCategory: EquipmentGasCategory) => {
                onToggle();
                onValueChange(gasCategory, name);
            },
            [onToggle, onValueChange, name],
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
                            <Text style={{ color: colors.text }}>{t('gas_category')}</Text>
                            <View
                                style={{
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <GradientIcon name="map-marker-alt" size={24} />
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{ color: colors.text, marginHorizontal: 10 }}
                                >
                                    {selected?.name || t('select_gas_category_placeholder')}
                                </Text>
                                <GradientIcon name="chevron-down" size={24} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <GasCategoryModal
                    nullable={nullable}
                    selected={selected}
                    visible={visible}
                    onChange={handleValueChange}
                    onClose={onToggle}
                />
            </React.Fragment>
        );
    },
);

export default GasCategoryPicker;
