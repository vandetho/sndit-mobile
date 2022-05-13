import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ROLES } from '@config';

const styles = StyleSheet.create({
    itemContainer: {
        height: 50,
    },
});

interface RolePickerProps {
    visible: boolean;
    onValueChange: (role: string) => void;
    onClose: () => void;
}

const RolePicker = React.memo<RolePickerProps>(({ visible, onClose }) => {
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.close();
        }
    }, [visible]);

    const snapPoints = React.useMemo(() => ['50%', '75%'], []);

    const roles = React.useMemo(() => Object.values(ROLES), []);

    const renderItem = React.useCallback(
        ({ item }: { item: string }) => <TouchableOpacity style={styles.itemContainer}></TouchableOpacity>,
        [],
    );

    return (
        <BottomSheetModal snapPoints={snapPoints} ref={bottomSheetRef}>
            <FlatList data={roles} renderItem={renderItem} />
        </BottomSheetModal>
    );
});

export default RolePicker;
