import React from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { EmployeeList, HeaderSection } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface EmployeesProps {}

const Employees = React.memo<EmployeesProps>(() => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    return (
        <SafeAreaView style={styles.container}>
            <HeaderSection animatedValue={animatedValue} />
            <EmployeeList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
            />
        </SafeAreaView>
    );
});

export default Employees;
