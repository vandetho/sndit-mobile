import React from 'react';
import { Package } from '@interfaces';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';

export const PACKAGE_ITEM_HEIGHT = 200;

interface PackageCardProps {
    item: Package;
    onPress?: (item: Package) => void;
}

const PackageCard = React.memo<PackageCardProps>(({ item, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const renderMarking = React.useCallback(
        () =>
            Object.keys(item.marking).map((marking, index) => (
                <Text key={`package-${item.id}-marking-${index}`}>{t(marking)}</Text>
            )),
        [item.id, item.marking, t],
    );

    const handlePress = React.useCallback(() => {
        if (onPress) {
            onPress(item);
        }
    }, [item, onPress]);

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View
                style={{
                    height: PACKAGE_ITEM_HEIGHT,
                    borderRadius: 15,
                    padding: 10,
                    backgroundColor: colors.card,
                    justifyContent: 'space-between',
                }}
            >
                <Text bold fontSize={16}>
                    {item.name}
                </Text>
                <Text>{item.address}</Text>
                {item.city && <Text>{item.city.name}</Text>}
                {renderMarking()}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                            {t('created_by')}
                        </Text>
                        <Text>
                            {item.creator.lastName} {item.creator.firstName}
                        </Text>
                    </View>
                    {item.deliverer && (
                        <View>
                            <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                                {t('delivered_by')}
                            </Text>
                            <Text>
                                {item.deliverer.lastName} {item.deliverer.firstName}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default PackageCard;
