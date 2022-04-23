import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useCompany, useUser } from '@contexts';
import { AddToCompanyButton, UserAvatar } from './components';
import { AVATAR_HEIGHT } from '@screens/User/components/UserAvatar/UserAvatar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewContainer: {
        flexGrow: 1,
        paddingTop: AVATAR_HEIGHT,
    },
    buttonContainer: {},
});

interface UserProps {}

const UserComponent: React.FunctionComponent<UserProps> = () => {
    const { managerCompanies } = useCompany();
    const { user } = useUser();
    const scrollY = React.useRef(new Animated.Value(0)).current;

    const renderButtons = React.useCallback(() => {
        const buttons: JSX.Element[] = [];
        if (managerCompanies.length) {
            buttons.push(<AddToCompanyButton companies={managerCompanies} />);
        }
        return buttons;
    }, [managerCompanies]);

    return (
        <View style={styles.container}>
            <UserAvatar user={user} scrollY={scrollY} />
            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={styles.viewContainer}
            >
                {renderButtons}
            </Animated.ScrollView>
        </View>
    );
};

const User = React.memo(UserComponent);

export default User;
