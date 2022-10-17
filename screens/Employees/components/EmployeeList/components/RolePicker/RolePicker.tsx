import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ROLES } from '@config';
import { useTheme } from '@react-navigation/native';
import { GradientIcon, Separator, SEPARATOR_HEIGHT, Text } from '@components';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    itemContainer: {
        height: 50,
        borderRadius: 15,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    closeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        padding: 10,
        borderRadius: 40,
    },
});

interface RolePickerProps {
    role: string;
    visible: boolean;
    onValueChange: (role: string) => void;
    onClose: () => void;
}

const RolePicker = React.memo<RolePickerProps>(({ role, visible, onValueChange, onClose }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.dismiss();
        }
    }, [visible]);

    const snapPoints = React.useMemo(() => ['50%', '75%'], []);

    const roles = React.useMemo(() => Object.values(ROLES), []);

    const renderItem = React.useCallback(
        ({ item }: { item: string }) =>
            item === ROLES.OWNER ? null : (
                <TouchableOpacity
                    disabled={role === item}
                    onPress={() => onValueChange(item)}
                    style={[styles.itemContainer, { backgroundColor: colors.background }]}
                >
                    <Text>{t(item)}</Text>
                    {role === item && <GradientIcon name="check" />}
                </TouchableOpacity>
            ),
        [colors.background, onValueChange, role, t],
    );
    const keyExtractor = React.useCallback((_, index: number) => `roles-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: 50 + SEPARATOR_HEIGHT,
            offset: (50 + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <BottomSheetModal
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            backgroundStyle={{ backgroundColor: colors.card }}
            handleIndicatorStyle={{ backgroundColor: colors.text }}
        >
            <FlatList
                data={roles}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                ListFooterComponent={() => (
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: colors.background }]}
                        onPress={onClose}
                    >
                        <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
                        <GradientIcon name="times" />
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
            />
        </BottomSheetModal>
    );
});

export default RolePicker;
