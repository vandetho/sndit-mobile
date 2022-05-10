import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useCompany, useUser } from '@contexts';
import { AddToCompanyButton, AVATAR_SIZE, HeaderButtons, UserAvatar } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewContainer: {
        flexGrow: 1,
        paddingTop: AVATAR_SIZE + 80,
        paddingHorizontal: 10,
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
        if (managerCompanies.length > 0) {
            buttons.push(<AddToCompanyButton companies={managerCompanies} key={`user-add-to-company-button`} />);
        }
        return buttons;
    }, [managerCompanies]);

    return (
        <View style={styles.container}>
            <HeaderButtons scrollY={scrollY} user={user} />
            <UserAvatar user={user} scrollY={scrollY} />
            <Animated.ScrollView
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={styles.viewContainer}
            >
                {renderButtons()}
            </Animated.ScrollView>
        </View>
    );
};

const User = React.memo(UserComponent);

export default User;
