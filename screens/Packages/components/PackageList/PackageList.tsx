import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { usePackage } from '@contexts';
import { GradientIcon, GradientText, Separator, SEPARATOR_HEIGHT } from '@components';
import { Package } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';

interface PackageListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onPressAddPackage: () => void;
}

const PackageListComponent: React.FunctionComponent<PackageListProps> = ({ onScroll, onPressAddPackage }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { packages, isLoading } = usePackage();

    const renderItem = React.useCallback(
        ({ item }: { item: Package }) => {
            if (item.id === 0) {
                return (

                );
            }
            return <PackageCard company={item} />;
        },
        [colors.card, onPressAddPackage],
    );

    const keyExtractor = React.useCallback((_, index: number) => `companies-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: CARD_HEIGHT + SEPARATOR_HEIGHT,
            offset: (CARD_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    const data = React.useMemo<Array<Package>>(
        () => [{ name: t('add_company'), id: 0, token: '', roles: [] }, ...companies],
        [companies, t],
    );

    return (<Animated.FlatList
            refreshing={isLoading}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            onScroll={onScroll}
            contentContainerStyle={{ flexGrow: 1, paddingTop: HEADER_HEIGHT, paddingHorizontal: 10 }}
        />
    );
};

const PackageList = React.memo(PackageListComponent);

export default PackageList;
