import React from 'react';
import { User } from '@interfaces';
import { Animated, StyleSheet } from 'react-native';
import Avatar from 'react-native-user-avatar';

export const AVATAR_HEIGHT = 75;

const styles = StyleSheet.create({
    container: {
        height: AVATAR_HEIGHT,
    },
});

interface UserAvatarProps {
    user: User;
    scrollY: Animated.Value;
}

const UserAvatarComponent: React.FunctionComponent<UserAvatarProps> = ({ user, scrollY }) => {
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [0, AVATAR_HEIGHT],
                                outputRange: [0, 25],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <Avatar name={`${user.lastName} ${user.firstName}`} src={user.imageFile} />
        </Animated.View>
    );
};

const UserAvatar = React.memo(UserAvatarComponent);

export default UserAvatar;
