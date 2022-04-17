import React from 'react';
import { Package } from '@interfaces';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';

export const PACKAGE_ITEM_HEIGHT = 100;

interface PackageCardProps {
    item: Package;
}

const PackageCard = React.memo<PackageCardProps>(({ item }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const renderMarking = React.useCallback(
        () =>
            Object.keys(item.marking).map((marking, index) => (
                <Text key={`package-${item.id}-marking-${index}`}>{t(marking)}</Text>
            )),
        [item.id, item.marking, t],
    );

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
            {item.city && <Text>{item.city.name}</Text>}
            {renderMarking()}
        </View>
    );
});

export default PackageCard;
