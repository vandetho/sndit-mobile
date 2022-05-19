import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompanyList, HeaderSection } from './components';
import { ApplicationStackParamsList } from '@navigations';
import { useAuthentication } from '@contexts';
import { Button, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { HEADER_HEIGHT } from '@screens/Packages/components';
import { FontAwesome5 } from '@expo/vector-icons';

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
                    <HeaderSection animatedValue={animatedValue} />
                    <CompanyList
                        animatedValue={animatedValue}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                            useNativeDriver: true,
                        })}
                        onPressAddCompany={onPressAddCompany}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: animatedValue.interpolate({
                                inputRange: [0, HEADER_HEIGHT],
                                outputRange: [0, 1],
                                extrapolate: 'clamp',
                            }),
                            transform: [
                                {
                                    translateY: animatedValue.interpolate({
                                        inputRange: [0, HEADER_HEIGHT],
                                        outputRange: [50, 0],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        }}
                    >
                        <Button
                            label={t('add_company')}
                            startIcon={<FontAwesome5 name="plus" color="#FFFFFF" size={20} />}
                            onPress={onPressAddCompany}
                        />
                    </Animated.View>
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

    return <View style={styles.container}>{renderContent()}</View>;
});

export default Companies;
