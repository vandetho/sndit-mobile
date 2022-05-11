import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import UserAvatar from 'react-native-user-avatar';
import { User } from '@interfaces';
import { useTheme } from '@react-navigation/native';
import { HeaderButtons } from './components';
import { Text } from '@components';

export const TOP_SECTION_HEIGHT = 250;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: TOP_SECTION_HEIGHT,
        alignItems: 'center',
        zIndex: 2,
    },
});
interface TopSectionProps {
    user: User;
    animatedValue: Animated.Value;
}

const TopSection = React.memo<TopSectionProps>(({ user, animatedValue }) => {
    const { colors } = useTheme();

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, TOP_SECTION_HEIGHT],
                                outputRange: [0, -150],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 100,
                    backgroundColor: colors.card,
                    zIndex: 1,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, TOP_SECTION_HEIGHT],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, TOP_SECTION_HEIGHT],
                                outputRange: [0, 150],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            />
            <HeaderButtons user={user} scrollY={animatedValue} />
            <Animated.View
                style={{
                    width: 100,
                    height: 100,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, TOP_SECTION_HEIGHT],
                        outputRange: [1, 0],
                        extrapolate: 'clamp',
                    }),
                }}
            >
                <TouchableOpacity style={{ width: 100, height: 100 }}>
                    <UserAvatar src={user.imageFile} name={`${user.lastName} ${user.firstName}`} size={100} />
                </TouchableOpacity>
            </Animated.View>
            <View style={{ zIndex: 3 }}>
                <Text bold fontSize={20}>
                    {user.lastName} {user.firstName}
                </Text>
            </View>
        </Animated.View>
    );
});

export default TopSection;
