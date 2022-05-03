import React from 'react';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-modules-core';
import { Notification } from 'expo-notifications';
import Constants from 'expo-constants';
import { axios } from '@utils';
import { useAuthentication } from './AuthenticationContext';

const NotificationContext = React.createContext({});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

interface NotificationProviderProps {}

export const NotificationProvider = React.memo<NotificationProviderProps>(({ children }) => {
    const { isLogged } = useAuthentication();
    const experienceId = Constants.manifest.extra.experienceId || '@bangkeut/sndit_beta';
    const [state, setState] = React.useState<{ expoPushToken: string; notification: Notification }>({
        expoPushToken: '',
        notification: undefined,
    });

    const notificationListener = React.useRef<Subscription>();
    const responseListener = React.useRef<Subscription>();

    const schedulePushNotification = React.useCallback(async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 2 },
        });
    }, []);

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

            if (notificationListener.current) {
                notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
                    setState((prevState) => ({ ...prevState, notification }));
                });
            }

            if (responseListener.current) {
                responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
                    console.log(response);
                });
            }

            return () => {
                Notifications.removeNotificationSubscription(notificationListener.current);
                Notifications.removeNotificationSubscription(responseListener.current);
            };
        }
    }, [isLogged, registerForPushNotificationsAsync]);

    return (
        <NotificationContext.Provider value={{ ...state, schedulePushNotification }}>
            {children}
        </NotificationContext.Provider>
    );
});

export const useNotification = () => {
    return React.useContext(NotificationContext);
};
