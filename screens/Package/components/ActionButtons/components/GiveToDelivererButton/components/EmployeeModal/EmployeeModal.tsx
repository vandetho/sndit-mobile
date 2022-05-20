import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { Text } from '@components/Text';
import { Company, Employee } from '@interfaces';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import { useEmployeesFetcher } from '@fetchers';
import { BarLoader } from '@components';

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

interface EmployeeModalProps {
    company: Company | undefined;
    visible: boolean;
    onSave: (employee: Employee) => void;
    onClose: () => void;
}

const EmployeeModal = React.memo<EmployeeModalProps>(({ company, visible, onSave, onClose }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const [state, setState] = React.useState<{ employee: Employee | undefined }>({ employee: undefined });
    const { employees, fetch, fetchMore, isLoading, isLoadingMore } = useEmployeesFetcher();

    const handleFetch = React.useCallback(async () => await fetch(company), [company, fetch]);

    React.useEffect(() => {
        if (visible && company) {
            (async () => await handleFetch())();
            setState((prevState) => ({ ...prevState, employee: undefined }));
        }
    }, [company, handleFetch, visible]);

    const handleFetchMore = React.useCallback(async () => {
        if (company && onEndReachedCalledDuringMomentum) {
            await fetchMore(company);
        }
    }, [company, fetchMore]);

    const renderItem = React.useCallback(
        ({ item }: { item: Employee }) => (
            <TouchableOpacity
                onPress={() => setState((prevState) => ({ ...prevState, employee: item }))}
                style={styles.itemContainer}
            >
                <Text numberOfLines={1} ellipsizeMode="tail" style={{ width: 200 }}>
                    {item.lastName} {item.firstName}
                </Text>
                {state.employee?.id === item.id && <GradientIcon name="check" />}
            </TouchableOpacity>
        ),
        [state.employee?.id],
    );

    const getItemLayout = React.useCallback((_, index) => ({ index, length: HEIGHT, offset: HEIGHT * index }), []);
    const keyExtractor = React.useCallback((_, index) => `cities-item-${index}`, []);
    const Separator = React.useCallback(
        () => <View style={{ height: 1, backgroundColor: colors.border }} />,
        [colors.border],
    );

    const renderFooter = React.useCallback(() => {
        return isLoadingMore ? (
            <View style={{ flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <BarLoader />
            </View>
        ) : null;
    }, [isLoadingMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <Modal
            isVisible={visible}
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
                <View
                    style={{
                        height: 80,
                        paddingTop: insets.top,
                        paddingHorizontal: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity onPress={onClose} style={{ flexDirection: 'row' }}>
                        <GradientIcon name="times" />
                        <Text bold style={{ marginHorizontal: 10 }}>
                            {t('close')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            state.employee && onSave(state.employee);
                        }}
                        style={{ flexDirection: 'row' }}
                    >
                        <Text bold style={{ marginHorizontal: 10 }}>
                            {t('save')}
                        </Text>
                        <GradientIcon name="check" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    refreshing={isLoading}
                    onRefresh={handleFetch}
                    data={employees}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    ItemSeparatorComponent={Separator}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={0.5}
                    scrollEventThrottle={16}
                    onMomentumScrollBegin={onMomentumScrollBegin}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: insets.bottom + 20,
                    }}
                />
            </View>
        </Modal>
    );
});

export default EmployeeModal;
