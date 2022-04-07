import React from 'react';
import { StyleProp, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { City } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { CityModal } from './components';

interface CityPickerProps {
    name?: string;
    selected: City | undefined;
    onValueChange: (city: City | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const CityPicker = React.memo<CityPickerProps>(({ name = 'city', selected, style, onValueChange }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const { visible, onToggle } = useVisible();

    const handleValueChange = React.useCallback(
        (city: City) => {
            onToggle();
            onValueChange(city, name);
        },
        [onToggle, onValueChange, name],
    );

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={onToggle}>
                <View
                    style={[
                        {
                            height: 50,
                            marginVertical: 5,
                        },
                        style,
                    ]}
                >
                    <Text style={{ color: colors.text }}>{t('location')}</Text>
                    <View
                        style={{
                            paddingVertical: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <GradientIcon name="map-marker-alt" size={24} />
                        <Text style={{ color: colors.text, marginHorizontal: 10 }}>
                            {selected?.name || t('select_city_placeholder')}
                        </Text>
                        <GradientIcon name="chevron-down" size={24} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <CityModal visible={visible} onChange={handleValueChange} onClose={onToggle} />
        </React.Fragment>
    );
});

export default CityPicker;
