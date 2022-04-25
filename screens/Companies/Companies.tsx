import React from 'react';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompanyList, HeaderSection } from './components';
import { ApplicationStackParamsList } from '@navigations';
import { useAuthentication } from '@contexts';
import { Button, Text } from '@components';
import { useTranslation } from 'react-i18next';

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

type NewCompanyNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'NewCompany' | 'Login'>;

interface CompaniesProps {}

const Companies = React.memo<CompaniesProps>(() => {
    const { isLogged } = useAuthentication();
    const { t } = useTranslation();
    const navigation = useNavigation<NewCompanyNavigationProp>();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onPressLogin = React.useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const onPressAddCompany = React.useCallback(() => {
        navigation.navigate('NewCompany');
    }, [navigation]);

    const renderContent = React.useCallback(() => {
        if (isLogged) {
            return (
                <React.Fragment>
                    <HeaderSection animatedValue={animatedValue} onPressAddCompany={onPressAddCompany} />
                    <CompanyList
                        animatedValue={animatedValue}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                            useNativeDriver: true,
                        })}
                        onPressAddCompany={onPressAddCompany}
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
    }, [animatedValue, isLogged, onPressAddCompany, onPressLogin, t]);

    return <SafeAreaView style={styles.container}>{renderContent()}</SafeAreaView>;
});

export default Companies;
