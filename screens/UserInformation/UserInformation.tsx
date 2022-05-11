import React from 'react';
import { Animated, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useAuthentication } from '@contexts';
import { ContentSection, TopSection } from './components';

interface UserInformationProps {}

const UserInformation = React.memo<UserInformationProps>(() => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const {
        jwt: { user },
    } = useAuthentication();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <TopSection animatedValue={animatedValue} />
                <ContentSection
                    user={user}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                        useNativeDriver: true,
                    })}
                />
            </View>
        </TouchableWithoutFeedback>
    );
});

export default UserInformation;
