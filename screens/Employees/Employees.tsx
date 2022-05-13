import React from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { EmployeeList, HeaderSection, RolePicker } from './components';
import { useVisible } from '@hooks';
import { Employee } from '@interfaces';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface EmployeesProps {}

const Employees = React.memo<EmployeesProps>(() => {
    const [state, setState] = React.useState<Employee>(undefined);
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { visible, onToggle } = useVisible();

    return (
        <SafeAreaView style={styles.container}>
            <HeaderSection animatedValue={animatedValue} />
            <EmployeeList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
            />
            <RolePicker onValueChange={onValueChange} visible={visible} onClose={onToggle} />
        </SafeAreaView>
    );
});

export default Employees;
