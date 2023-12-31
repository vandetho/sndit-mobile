import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Package } from '@interfaces';
import { Text } from '@components/Text';

export const NEW_PACKAGE_ITEM_HEIGHT = 100;

interface NewPackageCardProps {
    item: Package;
    onPressNewPackage: () => void;
}

const NewPackageCard = React.memo<NewPackageCardProps>(({ item, onPressNewPackage }) => {
    const { colors } = useTheme();
    return (
        <TouchableWithoutFeedback onPress={onPressNewPackage}>
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
        </TouchableWithoutFeedback>
    );
});

export default NewPackageCard;
