import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Package } from '@interfaces';
import { Text } from '@components/Text';

export const NEW_PACKAGE_ITEM_HEIGHT = 100;

interface NewPackageCardProps {
    item: Package;
}

const NewPackageCard = React.memo<NewPackageCardProps>(({ item }) => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                height: NEW_PACKAGE_ITEM_HEIGHT,
                borderRadius: 15,
                padding: 10,
                backgroundColor: colors.card,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <FontAwesome5 name="plus" size={26} color={colors.text} />
            <Text fontSize={16} style={{ marginHorizontal: 10 }}>
                {item.name}
            </Text>
        </View>
    );
});

export default NewPackageCard;
