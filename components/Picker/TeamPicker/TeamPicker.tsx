import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { EquipmentTeam } from '@interfaces';
import { useVisible } from '@hooks';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { TeamModal } from './components';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

interface TeamPickerProps {
    nullable?: boolean;
    name?: string;
    selected: EquipmentTeam | undefined;
    onValueChange: (team: EquipmentTeam | undefined, name?: string) => void;
    style?: StyleProp<ViewStyle>;
}

const TeamPicker = React.memo<TeamPickerProps>(
    ({ nullable = false, name = 'team', selected, style, onValueChange }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const { visible, onToggle } = useVisible();

        const handleValueChange = React.useCallback(
            (team: EquipmentTeam) => {
                onToggle();
                onValueChange(team, name);
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
                            <Text style={{ color: colors.text }}>{t('team')}</Text>
                            <View
                                style={{
                                    paddingVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <GradientIcon name="map-marker-alt" size={24} />
                                <Text style={{ color: colors.text, marginHorizontal: 10 }}>
                                    {selected?.name || t('select_team_placeholder')}
                                </Text>
                                <GradientIcon name="chevron-down" size={24} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <TeamModal
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

export default TeamPicker;
