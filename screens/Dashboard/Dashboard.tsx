import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { useNavigation } from '@react-navigation/native';
import { useAuthentication } from '@contexts';
import { HeaderSection, PackageList } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

type LoginScreenNavigationProps = StackNavigationProp<ApplicationStackParamsList, 'Login' | 'NewPackage'>;

interface DashboardProps {}

const Dashboard = React.memo<DashboardProps>(() => {
    const { isLogged } = useAuthentication();
    const { t } = useTranslation();
    const navigation = useNavigation<LoginScreenNavigationProps>();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onPressLogin = React.useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const renderContent = React.useCallback(() => {
        if (isLogged) {
            return (
                <React.Fragment>
                    <HeaderSection animatedValue={animatedValue} />
                    <PackageList
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                            useNativeDriver: true,
                        })}
                    />
                </React.Fragment>
            );
        }
        return (
            <View style={styles.loginContainer} testID="loginContainer">
                <Text style={{ marginVertical: 10 }}>{t('do_not_have_any_packages')}</Text>
                <Button label={t('login_or_signup')} onPress={onPressLogin} />
            </View>
        );
    }, [animatedValue, isLogged, onPressLogin, t]);

    return <View style={styles.container}>{renderContent()}</View>;
});

export default Dashboard;
