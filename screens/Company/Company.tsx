import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCompany } from '@contexts';
import { Button } from '@components';
import { CompanyDetail, HEADER_HEIGHT, PackageList } from './components';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ApplicationStackParamsList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type NewPackageScreenNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'NewPackage'>;

interface CompanyProps {}

const Company = React.memo<CompanyProps>(() => {
    const { t } = useTranslation();
    const navigation = useNavigation<NewPackageScreenNavigationProp>();
    const { company } = useCompany();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onPressNewPackage = React.useCallback(() => {
        navigation.navigate('NewPackage');
    }, [navigation]);

    return (
        <View style={styles.container}>
            <CompanyDetail company={company} animatedValue={animatedValue} />
            <PackageList
                company={company}
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
                    startIcon={<FontAwesome5 name="plus" color="#FFFFFF" />}
                    onPress={onPressNewPackage}
                />
            </Animated.View>
        </View>
    );
});

export default Company;
