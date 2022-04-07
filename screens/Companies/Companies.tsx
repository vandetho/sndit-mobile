import React from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompanyStackParamList } from '@navigations/CompanyNavigator';
import { CompanyList, HeaderSection } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type NewCompanyNavigationProp = StackNavigationProp<CompanyStackParamList, 'NewCompany'>;

interface CompaniesProps {}

const Companies = React.memo<CompaniesProps>(() => {
    const navigation = useNavigation<NewCompanyNavigationProp>();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onPressAddCompany = React.useCallback(() => {
        navigation.navigate('NewCompany');
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <HeaderSection animatedValue={animatedValue} onPressAddCompany={onPressAddCompany} />
            <CompanyList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                onPressAddCompany={onPressAddCompany}
            />
        </SafeAreaView>
    );
});

export default Companies;
