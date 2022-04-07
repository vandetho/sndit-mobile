import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EquipmentBrand, EquipmentModel } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { ModelModal } from './components';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

interface ModelPickerProps {
    nullable?: boolean;
    name?: string;
    brand: EquipmentBrand | undefined;
    selected: EquipmentModel | undefined;
    onValueChange: (model: EquipmentModel | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const ModelPicker = React.memo<ModelPickerProps>(
    ({ nullable = false, name = 'model', brand, selected, style, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (model: EquipmentModel) => {
                onToggle();
                onValueChange(model, name);
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
                            <Text style={{ color: colors.text }}>{t('model')}</Text>
                            <View
                                style={{
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <GradientIcon name="map-marker-alt" size={24} />
                                <Text style={{ color: colors.text, marginHorizontal: 10 }}>
                                    {selected?.name || t('select_model_placeholder')}
                                </Text>
                                <GradientIcon name="chevron-down" size={24} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ModelModal
                    nullable={nullable}
                    brand={brand}
                    selected={selected}
                    visible={visible}
                    onChange={handleValueChange}
                    onClose={onToggle}
                />
            </React.Fragment>
        );
    },
);

export default ModelPicker;
