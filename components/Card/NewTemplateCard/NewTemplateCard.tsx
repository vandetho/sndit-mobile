import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Template } from '@interfaces';
import { Text } from '@components/Text';

export const NEW_TEMPLATE_ITEM_HEIGHT = 100;

interface NewTemplateCardProps {
    template: Template;
    onPressNewTemplate: () => void;
}

const NewTemplateCard = React.memo<NewTemplateCardProps>(({ template, onPressNewTemplate }) => {
    const { colors } = useTheme();
    return (
        <TouchableWithoutFeedback onPress={onPressNewTemplate}>
            <View
                style={{
                    height: NEW_TEMPLATE_ITEM_HEIGHT,
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
                    {template.name}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default NewTemplateCard;
