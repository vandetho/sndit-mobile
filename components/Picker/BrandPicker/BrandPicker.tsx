import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EquipmentBrand } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { BrandModal } from './components';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

interface BrandPickerProps {
    nullable?: boolean;
    name?: string;
    selected: EquipmentBrand | undefined;
    onValueChange: (brand: EquipmentBrand | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const BrandPicker = React.memo<BrandPickerProps>(
    ({ nullable = false, name = 'brand', selected, style, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (brand: EquipmentBrand) => {
                onToggle();
                onValueChange(brand, name);
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
                            <Text style={{ color: colors.text }}>{t('brand')}</Text>
                            <View
                                style={{
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <GradientIcon name="map-marker-alt" size={24} />
                                <Text style={{ color: colors.text, marginHorizontal: 10 }}>
                                    {selected?.name || t('select_brand_placeholder')}
                                </Text>
                                <GradientIcon name="chevron-down" size={24} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <BrandModal
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

export default BrandPicker;
