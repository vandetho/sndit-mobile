import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePackage } from '@contexts';
import { NewPackageCard, PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PackageStackParamList } from '@navigations';

type PackageScreenNavigationProp = StackNavigationProp<PackageStackParamList, 'Package'>;

interface PackageListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onPressNewPackage: () => void;
}

const PackageListComponent: React.FunctionComponent<PackageListProps> = ({ onScroll, onPressNewPackage }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<PackageScreenNavigationProp>();
    const { packages, isLoading, onSelect } = usePackage();

    const data = React.useMemo<Array<Package>>(
        () => [{ id: 0, name: t('new_package'), token: '', roles: [] }, ...packages],
        [packages, t],
    );

    const onPress = React.useCallback(
        (item: Package) => {
            onSelect(item);
            navigation.navigate('Package');
        },
        [navigation, onSelect],
    );

    const renderItem = React.useCallback(
        ({ item }: { item: Package }) => {
            if (item.id === 0) {
                return <NewPackageCard item={item} onPressNewPackage={onPressNewPackage} />;
            }
            return <PackageCard item={item} onPress={onPress} />;
        },
        [onPress, onPressNewPackage],
    );

    const keyExtractor = React.useCallback((_, index: number) => `packages-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (PACKAGE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <Animated.FlatList
            refreshing={isLoading}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            onScroll={onScroll}
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT,
                paddingHorizontal: 10,
            }}
        />
    );
};

const PackageList = React.memo(PackageListComponent);

export default PackageList;
