import React from 'react';
import { Notification } from '@interfaces';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DISPLAY_DATETIME_FORMAT } from '@config';

export const NOTIFICATION_ITEM_HEIGHT = 175;

const styles = StyleSheet.create({
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    markingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
interface NotificationCardProps {
    notification: Notification;
    onPress?: (notification: Notification) => void;
}

const NotificationCard = React.memo<NotificationCardProps>(({ notification, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const handlePress = React.useCallback(() => {
        if (onPress) {
            onPress(notification);
        }
    }, [notification, onPress]);

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View
                style={{
                    height: NOTIFICATION_ITEM_HEIGHT,
                    borderRadius: 15,
                    padding: 20,
                    backgroundColor: notification.isRead ? colors.border : colors.card,
                    justifyContent: 'space-between',
                }}
            >
                <Text bold fontSize={16}>
                    {notification.title}
                </Text>
                <Text>{notification.body}</Text>
                <View style={styles.dateContainer}>
                    <Text fontSize={12}>{t('created_at')}</Text>
                    <Text>{format(new Date(notification.createdAt), DISPLAY_DATETIME_FORMAT)}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
});

export default NotificationCard;
