import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Separator, SEPARATOR_HEIGHT, Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Company, ResponseSuccess } from '@interfaces';
import { axios, showToast } from '@utils';
import { CompanyItem, ITEM_HEIGHT } from './components';
import { AxiosResponse } from 'axios';

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
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

    const snapPoints = React.useMemo(() => ['50%', '75%'], []);

    const onPress = React.useCallback(() => {
        if (bottomSheetModalRef.current) {
            bottomSheetModalRef.current.present();
        }
    }, []);

    const onPressCompany = React.useCallback(async (company: Company) => {
        try {
            const { data } = await axios.post<{ user: string | number }, AxiosResponse<ResponseSuccess<any>>>(
                `/api/companies/${company.token}/employees`,
            );
            showToast({ type: 'success', text2: data.message });
            if (bottomSheetModalRef.current) {
                bottomSheetModalRef.current.dismiss();
            }
        } catch (e) {
            if (!e.response) {
                console.error(e);
                return;
            }
            showToast({ type: 'error', text2: e.response.data.message || e.response.data.detail });
        }
    }, []);

    const renderItem = React.useCallback(
        ({ item }: { item: Company }) => <CompanyItem company={item} onPress={onPressCompany} />,
        [onPressCompany],
    );

    const keyExtractor = React.useCallback((_, index: number) => `manager-companies-item-${index}`, []);
    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            offset: (ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
            index,
            length: ITEM_HEIGHT + SEPARATOR_HEIGHT,
        }),
        [],
    );

    return (
        <React.Fragment>
            <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: colors.card }]}>
                <Text>{t('add_to_company')}</Text>
            </TouchableOpacity>
            <BottomSheetModal
                index={1}
                snapPoints={snapPoints}
                ref={bottomSheetModalRef}
                backgroundStyle={{ backgroundColor: colors.card }}
                handleIndicatorStyle={{ backgroundColor: colors.text }}
            >
                <FlatList
                    data={companies}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    ItemSeparatorComponent={Separator}
                    contentContainerStyle={styles.listContainer}
                />
            </BottomSheetModal>
        </React.Fragment>
    );
};

const AddToCompanyButton = React.memo(AddToCompanyButtonComponent);

export default AddToCompanyButton;
