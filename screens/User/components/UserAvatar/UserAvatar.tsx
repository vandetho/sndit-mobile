import React from 'react';
import { User } from '@interfaces';
import { Animated, StyleSheet } from 'react-native';
import Avatar from 'react-native-user-avatar';

export const AVATAR_SIZE = 125;

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        position: 'absolute',
        top: 70,
        zIndex: 1,
    },
});

interface UserAvatarProps {
    user: User;
    scrollY: Animated.Value;
}

const UserAvatarComponent: React.FunctionComponent<UserAvatarProps> = ({ user, scrollY }) => {
    const inputRange = React.useMemo(() => [0, AVATAR_SIZE], []);
    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: scrollY.interpolate({
                        inputRange,
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                    }),
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange,
                                outputRange: [0, -AVATAR_SIZE],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <Avatar name={`${user.lastName} ${user.firstName}`} size={100} src={user.imageFile} />
        </Animated.View>
    );
};

const UserAvatar = React.memo(UserAvatarComponent);

export default UserAvatar;
