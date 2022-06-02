import React from 'react';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { TouchableOpacity, View } from 'react-native';
import {
    BarLoader,
    EmptyTemplate,
    GradientIcon,
    Separator,
    SEPARATOR_HEIGHT,
    TEMPLATE_ITEM_HEIGHT,
    TemplateCard,
    Text,
} from '@components';
import { Company, Template } from '@interfaces';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTemplatesFetcher } from '@fetchers';

let onEndReachedCalledDuringMomentum = true;

interface TemplatesProps {
    company: Company;
    visible: boolean;
    onPress: (template: Template) => void;
    onClose: () => void;
}

const Templates = React.memo<TemplatesProps>(({ company, visible, onPress, onClose }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { templates, isLoading, isLoadingMore, fetch, fetchMore } = useTemplatesFetcher();

    const bottomSheetRef = React.useRef<BottomSheetModal>(null);

    const handleFetch = React.useCallback(async () => {
        await fetch(company);
    }, [company, fetch]);

    React.useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.dismiss();
        }
    }, [visible]);

    const snapPoints = React.useMemo(() => ['70%', '90%'], []);

    const renderItem = React.useCallback(
        ({ item }: { item: Template }) => {
            return <TemplateCard template={item} withEdit={false} onPress={onPress} />;
        },
        [onPress],
    );

    const keyExtractor = React.useCallback((_, index: number) => `templates-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: TEMPLATE_ITEM_HEIGHT + SEPARATOR_HEIGHT,
            offset: (TEMPLATE_ITEM_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    const renderFooter = React.useCallback(
        () =>
            isLoadingMore && (
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <BarLoader />
                </View>
            ),
        [isLoadingMore],
    );

    const handleFetchMore = React.useCallback(async () => {
        if (onEndReachedCalledDuringMomentum) {
            await fetchMore(company);
        }
    }, [company, fetchMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <BottomSheetModal
            backgroundStyle={{ backgroundColor: colors.card }}
            handleIndicatorStyle={{ backgroundColor: colors.text }}
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            onDismiss={onClose}
        >
            <TouchableOpacity
                onPress={onClose}
                style={{
                    marginRight: 10,
                    marginBottom: 10,
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    height: 40,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    backgroundColor: colors.card,
                }}
            >
                <Text style={{ marginRight: 10 }}>{t('close')}</Text>
                <GradientIcon name="times" />
            </TouchableOpacity>
            <BottomSheetFlatList
                onRefresh={handleFetch}
                refreshing={isLoading}
                data={templates}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                ListEmptyComponent={EmptyTemplate}
                ListFooterComponent={renderFooter}
                onEndReached={handleFetchMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={onMomentumScrollBegin}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: 20,
                    paddingHorizontal: 10,
                    paddingBottom: 75,
                    backgroundColor: colors.background,
                }}
            />
        </BottomSheetModal>
    );
});

export default Templates;
