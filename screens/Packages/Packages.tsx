import React from 'react';
import { Animated, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { Button, Separator } from '@components';
import { HEADER_HEIGHT } from '@screens/Company/components';
import { FontAwesome5 } from '@expo/vector-icons';
import { HeaderSection, PackageList } from '@screens/Packages/components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type NewPackageNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'NewPackage'>;

interface PackagesProps {}

const Packages = React.memo<PackagesProps>(() => {
    const navigation = useNavigation<NewPackageNavigationProp>();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onPressAddPackage = React.useCallback(() => {
        navigation.navigate('NewPackage');
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <HeaderSection animatedValue={animatedValue} onPressAddPackage={onPressAddPackage} />
            <PackageList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                onPressAddPackage={}
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
                    label={t('new_package')}
                    startIcon={<FontAwesome5 name="plus" color="#FFFFFF" />}
                    onPress={onPressNewPackage}
                />
            </Animated.View>
        </SafeAreaView>
    );
});

export default Packages;
