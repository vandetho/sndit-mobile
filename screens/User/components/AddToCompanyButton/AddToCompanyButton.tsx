import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Company } from '@interfaces';

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 15,
    },
    listContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
});

interface AddToCompanyButtonProps {
    companies: Company[];
}

const AddToCompanyButtonComponent: React.FunctionComponent<AddToCompanyButtonProps> = ({ companies }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

    const snapPoints = React.useMemo(() => ['25%', '50%'], []);

    const onPress = React.useCallback(() => {
        if (bottomSheetModalRef.current) {
            bottomSheetModalRef.current.present();
        }
    }, []);

    const renderItem = React.useCallback(
        ({ item }: { item: Company }) => {
            return (
                <TouchableOpacity style={{ backgroundColor: colors.card, borderRadius: 15, height: 50 }}>
                    <Text>{item.name}</Text>
                </TouchableOpacity>
            );
        },
        [colors.card],
    );

    const keyExtractor = React.useCallback((_, index: number) => `manager-companies-item-${index}`, []);
    const getItemLayout = React.useCallback((_, index: number) => ({ offset: 50 * index, index, length: 50 }), []);

    return (
        <React.Fragment>
            <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: colors.card }]}>
                <Text>{t('add_to_company')}</Text>
            </TouchableOpacity>
            <BottomSheetModal index={1} snapPoints={snapPoints} ref={bottomSheetModalRef}>
                <FlatList
                    data={companies}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    contentContainerStyle={styles.listContainer}
                />
            </BottomSheetModal>
        </React.Fragment>
    );
};

const AddToCompanyButton = React.memo(AddToCompanyButtonComponent);

export default AddToCompanyButton;
