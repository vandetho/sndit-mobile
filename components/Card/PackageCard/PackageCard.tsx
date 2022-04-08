import React from 'react';
import { Package } from '@interfaces';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';

export const PACKAGE_ITEM_HEIGHT = 100;

interface PackageCardProps {
    item: Package;
}

const PackageCard = React.memo<PackageCardProps>(({ item }) => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                height: PACKAGE_ITEM_HEIGHT,
                borderRadius: 15,
                padding: 10,
                backgroundColor: colors.card,
            }}
        >
            <Text fontSize={16}>{item.name}</Text>
            <Text>{item.address}</Text>
            <Text>{item.city.name}</Text>
        </View>
    );
});

export default PackageCard;
