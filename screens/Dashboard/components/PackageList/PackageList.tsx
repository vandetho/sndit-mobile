import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePackage } from '@contexts';
import { BarLoader, PACKAGE_ITEM_HEIGHT, PackageCard, Separator, SEPARATOR_HEIGHT, Text } from '@components';
import { Package } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { useOnDeliveryPackagesFetcher, useWaitingForDeliveryPackagesFetcher } from '@fetchers';
import { showToast } from '@utils';
import { EmptyOnDelivery, EmptyWaitingForDelivery } from './components';

let onEndReachedCalledDuringMomentum = true;

type PackageScreenNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'Package'>;

interface PackageListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const PackageListComponent: React.FunctionComponent<PackageListProps> = ({ onScroll }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<PackageScreenNavigationProp>();
    const { errorMessage, packages, isLoading, isLoadingMore, fetchMore, fetch } = useOnDeliveryPackagesFetcher();
    const {
        errorMessage: errorMessageWaitingForDelivery,
        packages: packagesWaitingForDelivery,
        isLoading: isLoadingWaitingForDelivery,
        isLoadingMore: isLoadingMoreWaitingForDelivery,
        fetchMore: fetchMoreWaitingForDelivery,
        fetch: fetchWaitingForDelivery,
    } = useWaitingForDeliveryPackagesFetcher();
    const { onSelect } = usePackage();

    const handleFetch = React.useCallback(() => {
        fetch();
        fetchWaitingForDelivery();
    }, [fetch, fetchWaitingForDelivery]);

    React.useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    React.useEffect(() => {
        if (errorMessage || errorMessageWaitingForDelivery) {
            showToast({ type: 'error', text2: errorMessage || errorMessageWaitingForDelivery });
        }
    }, [errorMessage, errorMessageWaitingForDelivery]);

    const data = React.useMemo(
        () => [
            { id: 1, title: t('on_delivery'), data: packages },
            {
                id: 2,
                title: t('waiting_for_delivery'),
                data: packagesWaitingForDelivery,
            },
        ],
        [packages, packagesWaitingForDelivery, t],
    );

    const onPress = React.useCallback(
        (item: Package) => {
            onSelect(item);
            navigation.navigate('Package');
        },
        [navigation, onSelect],
    );

    const renderSectionHeader = React.useCallback(({ section }) => {
        return (
            <Text bold fontSize={18}>
                {section.title}
            </Text>
        );
    }, []);

    const renderItem = React.useCallback(
        ({ item }: { item: Package }) => <PackageCard item={item} onPress={onPress} />,
        [onPress],
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

    const renderSectionFooter = React.useCallback(({ section }) => {
        if (section.data.length === 0 && section.id === 1) {
            return <EmptyOnDelivery />;
        }
        if (section.data.length === 0 && section.id === 2) {
            return <EmptyWaitingForDelivery />;
        }
        return null;
    }, []);

    const renderFooter = React.useCallback(
        () =>
            (isLoadingMore || isLoadingMoreWaitingForDelivery) && (
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <BarLoader />
                </View>
            ),
        [isLoadingMore, isLoadingMoreWaitingForDelivery],
    );

    const handleFetchMore = React.useCallback(() => {
        if (onEndReachedCalledDuringMomentum) {
            fetchMore();
            fetchMoreWaitingForDelivery();
        }
    }, [fetchMore, fetchMoreWaitingForDelivery]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <Animated.SectionList
            onRefresh={handleFetch}
            refreshing={isLoading || isLoadingWaitingForDelivery}
            sections={data}
            renderSectionHeader={renderSectionHeader}
            renderSectionFooter={renderSectionFooter}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            onScroll={onScroll}
            ListFooterComponent={renderFooter}
            onEndReached={handleFetchMore}
            onEndReachedThreshold={0.5}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            onMomentumScrollBegin={onMomentumScrollBegin}
            stickySectionHeadersEnabled
            contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_HEIGHT,
                paddingHorizontal: 10,
                paddingBottom: 75,
            }}
        />
    );
};

const PackageList = React.memo(PackageListComponent);

export default PackageList;
