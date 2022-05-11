import React from 'react';
import { MenuItem } from '@interfaces';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AccountStackParamsList } from '@navigations';
import { FontAwesome5 } from '@expo/vector-icons';
import { GradientIcon, Text } from '@components';

export const ITEM_HEIGHT = 50;

type AccountStackNavigationProps = StackNavigationProp<AccountStackParamsList, keyof AccountStackParamsList>;

interface SettingItemProps {
    item: MenuItem;
}

const SettingItem = React.memo<SettingItemProps>(({ item }) => {
    const { colors } = useTheme();
    const navigation = useNavigation<AccountStackNavigationProps>();

    const onNavigate = React.useCallback(() => {
        if (item.screen) {
            navigation.navigate(item.screen as keyof AccountStackParamsList);
        }
        if (item.onPress) {
            item.onPress();
        }
    }, [item, navigation]);

    return (
        <TouchableOpacity
            style={{
                backgroundColor: colors.card,
                height: ITEM_HEIGHT,
                paddingHorizontal: 20,
                justifyContent: item.screen ? 'space-between' : 'center',
                alignItems: 'center',
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
            }}
            onPress={onNavigate}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.icon && (
                    <View
                        style={{
                            backgroundColor: item.iconBackgroundColor,
                            width: 35,
                            height: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5,
                            marginRight: 10,
                        }}
                    >
                        <FontAwesome5 name={item.icon} color={item.iconColor || '#FFFFFF'} size={24} />
                    </View>
                )}
                <Text>{item.text}</Text>
            </View>
            {item.screen && <GradientIcon name="chevron-right" />}
        </TouchableOpacity>
    );
});

export default SettingItem;
