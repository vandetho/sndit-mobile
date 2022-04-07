import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { EquipmentMaintenanceType, EquipmentType } from '@interfaces';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { BarLoader } from '@components/Loader';
import { useFetcherEquipmentMaintenanceTypes } from '@fetchers';
import { LineSeparator } from '@components/LineSeparator';
import { EmptyMaintenanceType } from '@components/Empty/EmptyMaintenanceType';

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

interface MaintenanceTypeModalProps {
    visible: boolean;
    equipmentType: EquipmentType | undefined;
    selected: EquipmentMaintenanceType | undefined;
    onChange: (type: EquipmentMaintenanceType) => void;
    onClose: () => void;
}

const MaintenanceTypeModal = React.memo<MaintenanceTypeModalProps>(
    ({ visible, equipmentType, selected, onChange, onClose }) => {
        const { colors } = useTheme();
        const { t } = useTranslation();
        const insets = useSafeAreaInsets();
        const { maintenanceTypes, isLoading, isLoadingMore, fetch, fetchMore } = useFetcherEquipmentMaintenanceTypes();
        const { height } = useWindowDimensions();

        const handleFetchMore = React.useCallback(() => {
            (async () => fetchMore(equipmentType))();
        }, [equipmentType, fetchMore]);

        React.useEffect(() => {
            (async () => fetch(equipmentType))();
        }, [equipmentType, fetch]);

        const renderItem = React.useCallback(
            ({ item }: { item: EquipmentMaintenanceType }) => (
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

        const keyExtractor = React.useCallback((_, index) => `maintenance-types-item-${index}`, []);

        const Footer = React.useCallback(
            () => (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>{isLoadingMore && <BarLoader />}</View>
            ),
            [isLoadingMore],
        );

        const onMomentumScrollBegin = React.useCallback(() => {
            onEndReachedCalledDuringMomentum = false;
        }, []);

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
                        data={maintenanceTypes}
                        renderItem={renderItem}
                        keyExtractor={keyExtractor}
                        getItemLayout={getItemLayout}
                        ItemSeparatorComponent={LineSeparator}
                        ListFooterComponent={Footer}
                        ListEmptyComponent={EmptyMaintenanceType}
                        onEndReached={handleFetchMore}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onEndReachedThreshold={0.05}
                        scrollEventThrottle={16}
                        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}
                    />
                </View>
            </Modal>
        );
    },
);

export default MaintenanceTypeModal;
