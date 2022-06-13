import React from 'react';
import { Animated, Linking, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { BarLoader, NOTIFICATION_ITEM_HEIGHT, NotificationCard, Separator, SEPARATOR_HEIGHT, Text } from '@components';
import { Notification } from '@interfaces';
import { useNotificationsFetcher } from '@fetchers';
import { HEADER_HEIGHT } from '../HeaderSection';
import { useTranslation } from 'react-i18next';
import { usePackage } from '@contexts';

let onEndReachedCalledDuringMomentum = true;

interface NotificationListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const NotificationListComponent: React.FunctionComponent<NotificationListProps> = ({ onScroll }) => {
    const { t } = useTranslation();
    const { onSelect } = usePackage();
    const { notifications, isLoading, isLoadingMore, fetchMore, fetch } = useNotificationsFetcher();

    const onPress = React.useCallback(async (notification: Notification) => {
        onSelect(undefined);
        await Linking.openURL(notification.data.url);
    }, []);

    const renderItem = React.useCallback(
        ({ item }: { item: Notification }) => <NotificationCard notification={item} onPress={onPress} />,
        [onPress],
    );

    const keyExtractor = React.useCallback((_, index: number) => `notifications-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: NOTIFICATION_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (NOTIFICATION_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    const renderFooter = React.useCallback(
        () =>
            isLoadingMore && (
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <BarLoader />
                </View>
            ),
        [isLoadingMore],
    );

    const Empty = React.useCallback(
        () => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{t('no_notification')}</Text>
            </View>
        ),
        [t],
    );

    const handleFetchMore = React.useCallback(async () => {
        if (onEndReachedCalledDuringMomentum) {
            await fetchMore();
        }
    }, [fetchMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <Animated.FlatList
            onRefresh={fetch}
            refreshing={isLoading}
            data={notifications}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={Empty}
            onScroll={onScroll}
            ListFooterComponent={renderFooter}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={onMomentumScrollBegin}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT + 10,
                paddingHorizontal: 10,
                paddingBottom: 75,
            }}
        />
    );
};

const NotificationList = React.memo(NotificationListComponent);

export default NotificationList;
