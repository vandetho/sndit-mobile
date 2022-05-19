import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { Button } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { HEADER_HEIGHT, HeaderSection, PackageList } from './components';
import { useCompany } from '@contexts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type NewPackageNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'NewPackage'>;

interface PackagesProps {}

const Packages = React.memo<PackagesProps>(() => {
    const { t } = useTranslation();
    const { onSelect } = useCompany();
    const navigation = useNavigation<NewPackageNavigationProp>();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onPressNewPackage = React.useCallback(() => {
        onSelect(undefined);
        navigation.navigate('NewPackage');
    }, [navigation, onSelect]);

    return (
        <View style={styles.container}>
            <HeaderSection animatedValue={animatedValue} />
            <PackageList
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                onPressNewPackage={onPressNewPackage}
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
                    startIcon={<FontAwesome5 name="plus" color="#FFFFFF" size={20} />}
                    onPress={onPressNewPackage}
                />
            </Animated.View>
        </View>
    );
});

export default Packages;
