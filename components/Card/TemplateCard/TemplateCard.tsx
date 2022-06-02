import React from 'react';
import { Template } from '@interfaces';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';
import { GradientIcon } from '@components/Gradient';

export const TEMPLATE_ITEM_HEIGHT = 175;

const styles = StyleSheet.create({
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
interface TemplateCardProps {
    template: Template;
    withEdit?: boolean;
    onPress?: (template: Template) => void;
}

const TemplateCard = React.memo<TemplateCardProps>(({ template, withEdit = true, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const handlePress = React.useCallback(() => {
        if (onPress) {
            onPress(template);
        }
    }, [template, onPress]);

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View
                style={{
                    height: TEMPLATE_ITEM_HEIGHT,
                    borderRadius: 15,
                    padding: 10,
                    backgroundColor: colors.card,
                    justifyContent: 'space-between',
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text bold fontSize={16}>
                        {template.name}
                    </Text>
                    {template.phoneNumber && (
                        <Text bold fontSize={16}>
                            {template.phoneNumber}
                        </Text>
                    )}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'space-between' }}>
                        <Text>{template.address}</Text>
                        {template.city && <Text>{template.city.name}</Text>}
                        <View style={styles.nameContainer}>
                            <Text>{template.company.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                                    {t('created_by')}
                                </Text>
                                <Text>
                                    {template.creator.lastName} {template.creator.firstName}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {withEdit && <GradientIcon name="edit" />}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default TemplateCard;
