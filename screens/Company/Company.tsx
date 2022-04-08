import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCompany } from '@contexts';
import { usePackagesFetcher } from '@fetchers';
import { Button, NewPackageCard, PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { CompanyDetail, HEADER_HEIGHT } from './components';
import { FontAwesome5 } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { useNavigation } from '@react-navigation/native';

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
    const { fetchCompany, companiesPackages, isLoading } = usePackagesFetcher();

    React.useEffect(() => {
        if (company) {
            (async () => await fetchCompany(company))();
        }
    }, [company, fetchCompany]);

    const data = React.useMemo<Array<Package>>(
        () => [{ id: 0, name: t('new_package'), token: '', roles: [] }, ...companiesPackages],
        [companiesPackages, t],
    );

    const onPressNewPackage = React.useCallback(() => {
        navigation.navigate('NewPackage');
    }, [navigation]);

    const renderItem = React.useCallback(
        ({ item }: { item: Package }) => {
            if (item.id === 0) {
                return <NewPackageCard item={item} onPressNewPackage={onPressNewPackage} />;
            }
            return <PackageCard item={item} />;
        },
        [onPressNewPackage],
    );

    const keyExtractor = React.useCallback((_, index: number) => `company-packages-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <View style={styles.container}>
            <CompanyDetail company={company} animatedValue={animatedValue} />
            <Animated.FlatList
                refreshing={isLoading}
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={{ flexGrow: 1, paddingTop: HEADER_HEIGHT, paddingHorizontal: 10 }}
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
