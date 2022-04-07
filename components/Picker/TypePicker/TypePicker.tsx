import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EquipmentType } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { TypeModal } from './components';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

interface TypePickerProps {
    nullable?: boolean;
    name?: string;
    selected: EquipmentType | undefined;
    onValueChange: (type: EquipmentType | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const TypePicker = React.memo<TypePickerProps>(
    ({ nullable = false, name = 'type', selected, style, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (type: EquipmentType) => {
                onToggle();
                onValueChange(type, name);
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
                                    {selected?.name || t('select_type_placeholder')}
                                </Text>
                                <GradientIcon name="chevron-down" size={24} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <TypeModal
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

export default TypePicker;
