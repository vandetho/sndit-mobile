import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { EquipmentGasCategory } from '@interfaces';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { useFetcherEquipmentGasCategories } from '@fetchers';
import { BarLoader } from '@components/Loader';
import { EmptyGasCategory } from '@components/Empty/EmptyGasCategory';
import { LineSeparator } from '@components/LineSeparator';

export const HEIGHT = 40;

const styles = StyleSheet.create({
    itemContainer: {
        height: HEIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});

let onEndReachedCalledDuringMomentum = true;

interface GasCategoryModalProps {
    nullable: boolean;
    visible: boolean;
    selected: EquipmentGasCategory | undefined;
    onChange: (gasCategory: EquipmentGasCategory) => void;
    onClose: () => void;
}

const GasCategoryModal = React.memo<GasCategoryModalProps>(({ nullable, visible, selected, onChange, onClose }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { gasCategories, isLoading, isLoadingMore, fetch, fetchMore } = useFetcherEquipmentGasCategories();
    const { height } = useWindowDimensions();

    React.useEffect(() => {
        if (visible) {
            (async () => fetch())();
        }
    }, [fetch, visible]);

    const renderItem = React.useCallback(
        ({ item }: { item: EquipmentGasCategory }) => (
            <TouchableOpacity onPress={() => onChange(item)} style={styles.itemContainer}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                    {item.name}
                </Text>
                {item.id === selected?.id && <GradientIcon name="check" />}
            </TouchableOpacity>
        ),
        [onChange, selected?.id],
    );

    const getItemLayout = React.useCallback((_, index) => ({ index, length: HEIGHT, offset: HEIGHT * index }), []);

    const keyExtractor = React.useCallback((_, index) => `gas_categories-item-${index}`, []);

    const Footer = React.useCallback(
        () => <View style={{ justifyContent: 'center', alignItems: 'center' }}>{isLoadingMore && <BarLoader />}</View>,
        [isLoadingMore],
    );

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    const data = React.useMemo(
        () => (nullable ? [{ name: t('select_gas_category_placeholder') }, ...gasCategories] : gasCategories),
        [gasCategories, nullable, t],
    );

    return (
        <Modal
            isVisible={visible}
            swipeDirection={['down']}
            onSwipeComplete={onClose}
            style={{
                margin: 0,
            }}
        >
            <View
                style={{
                    height,
                    backgroundColor: colors.card,
                }}
            >
                <View style={{ height: 60, marginTop: insets.top, paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ flexDirection: 'row', width: 100, alignItems: 'center' }}
                    >
                        <GradientIcon name="times" />
                        <Text bold style={{ marginHorizontal: 10 }}>
                            {t('close')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    refreshing={isLoading}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    ItemSeparatorComponent={LineSeparator}
                    ListFooterComponent={Footer}
                    ListEmptyComponent={EmptyGasCategory}
                    onEndReached={fetchMore}
                    onMomentumScrollBegin={onMomentumScrollBegin}
                    onEndReachedThreshold={0.05}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
                />
            </View>
        </Modal>
    );
});

export default GasCategoryModal;
