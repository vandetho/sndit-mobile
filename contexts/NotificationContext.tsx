import React from 'react';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { Notification } from 'expo-notifications';
import Constants from 'expo-constants';
import { axios } from '@utils';
import { useAuthentication } from './AuthenticationContext';
import { useApplication } from './ApplicationContext';
import { usePackage } from './PackageContext';

const NotificationContext = React.createContext({
    schedulePushNotification: () => {
        console.log({ name: 'schedulePushNotification' });
    },
});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

interface NotificationProviderProps {
    children?: React.ReactNode;
}

export const NotificationProvider = React.memo<NotificationProviderProps>(({ children }) => {
    const { isBeta } = useApplication();
    const { isLogged } = useAuthentication();
    const { onSelect } = usePackage();
    const experienceId = Constants.manifest.extra.experienceId || '@vandetho/sndit_beta';
    const [state, setState] = React.useState<{ expoPushToken: string; notification: Notification }>({
        expoPushToken: '',
        notification: undefined,
    });

    const notificationListener = React.useRef<Subscription>();
    const responseListener = React.useRef<Subscription>();

    const schedulePushNotification = React.useCallback(async () => {
        const scheme = isBeta ? 'snditbeta' : 'sndit';
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { url: `${scheme}://packages/aa45e6cd-4d5b-41b7-b575-16a1f8c350e6` },
            },
            trigger: { seconds: 2 },
        });
    }, [isBeta]);

    const registerForPushNotificationsAsync = React.useCallback(async () => {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync({ experienceId })).data;
            try {
                await axios.post(`/api/users/current/notification-tokens`, { token });
            } catch (e) {
                console.error(e);
            }
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }, [experienceId]);

    React.useEffect(() => {
        if (isLogged) {
            registerForPushNotificationsAsync().then((token) =>
                setState((prevState) => ({ ...prevState, expoPushToken: token })),
            );

            notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
                setState((prevState) => ({ ...prevState, notification }));
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener(async (response) => {
                const url = response.notification.request.content.data.url as string;
                onSelect(undefined);
                await Linking.openURL(url);
            });
        }

        return () => {
            if (isLogged) {
                if (notificationListener.current) {
                    Notifications.removeNotificationSubscription(notificationListener.current);
                }
                if (responseListener.current) {
                    Notifications.removeNotificationSubscription(responseListener.current);
                }
            }
        };
    }, [isLogged, onSelect, registerForPushNotificationsAsync]);

    return (
        <NotificationContext.Provider value={{ ...state, schedulePushNotification }}>
            {children}
        </NotificationContext.Provider>
    );
});

export const useNotification = () => {
    return React.useContext(NotificationContext);
};
