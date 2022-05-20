import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlatList, View } from 'react-native';
import { BarLoader, Separator, SEPARATOR_HEIGHT, TEMPLATE_ITEM_HEIGHT, TemplateCard } from '@components';
import { HEADER_HEIGHT } from '@screens/Packages/components';
import { useTemplate } from '@contexts';
import { Template } from '@interfaces';

let onEndReachedCalledDuringMomentum = true;

interface TemplatesProps {
    visible: boolean;
    onPress: (template: Template) => void;
}

const Templates = React.memo<TemplatesProps>(({ visible, onPress }) => {
    const { templates, isLoading, isLoadingMore, onFetch, onFetchMore } = useTemplate();

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

    const snapPoints = React.useMemo(() => ['60%', '80%'], []);

    const renderItem = React.useCallback(
        ({ item }: { item: Template }) => {
            return <TemplateCard template={item} onPress={onPress} />;
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
            await onFetchMore();
        }
    }, [onFetchMore]);

    const onMomentumScrollBegin = React.useCallback(() => {
        onEndReachedCalledDuringMomentum = false;
    }, []);

    return (
        <BottomSheetModal snapPoints={snapPoints} ref={bottomSheetRef}>
            <FlatList
                onRefresh={onFetch}
                refreshing={isLoading}
                data={templates}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                ListFooterComponent={renderFooter}
                onEndReached={handleFetchMore}
                onEndReachedThreshold={0.5}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={onMomentumScrollBegin}
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 10,
                    paddingBottom: 75,
                }}
            />
        </BottomSheetModal>
    );
});

export default Templates;
