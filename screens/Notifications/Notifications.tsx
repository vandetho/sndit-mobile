import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { HeaderSection, NotificationList } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface NotificationsProps {}

const NotificationsComponent: React.FunctionComponent<NotificationsProps> = () => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <HeaderSection animatedValue={animatedValue} />
            <NotificationList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
            />
        </View>
    );
};

const Notifications = React.memo(NotificationsComponent);

export default Notifications;
