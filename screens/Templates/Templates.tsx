import React from 'react';
import { useCompany } from '@contexts';
import { useTemplatesFetcher } from '@fetchers';
import { Animated, StyleSheet, View } from 'react-native';
import { BarLoader, CARD_HEIGHT, Separator, SEPARATOR_HEIGHT, TemplateCard } from '@components';
import { HEADER_HEIGHT, HeaderSection, TemplateForm } from './components';
import { Template } from '@interfaces';
import { useVisible } from '@hooks';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {},
});

let onEndReachedCalledDuringMomentum = true;

interface TemplatesProps {}

const Templates = React.memo<TemplatesProps>(() => {
    const { company } = useCompany();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const { visible, onToggle, onClose } = useVisible();
    const [template, setTemplate] = React.useState<Template>(undefined);
    const { templates, isLoading, isLoadingMore, fetch, fetchMore } = useTemplatesFetcher();

    const handleFetch = React.useCallback(async () => {
        await fetch(company);
    }, [company, fetch]);

    React.useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    const onEditTemplate = React.useCallback(
        (template: Template) => {
            setTemplate(template);
            onToggle();
        },
        [onToggle],
    );

    const renderItem = React.useCallback(
        ({ item }) => <TemplateCard template={item} onPress={onEditTemplate} />,
        [onEditTemplate],
    );

    const keyExtractor = React.useCallback(
        (_, index: number) => `company-${company.id}-templates-item-${index}`,
        [company.id],
    );

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: CARD_HEIGHT + SEPARATOR_HEIGHT,
            offset: (CARD_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    const onPressNew = React.useCallback(async () => {
        setTemplate(undefined);
        onToggle();
    }, [onToggle]);

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

    const onSave = React.useCallback(async () => {
        handleFetch();
        onClose();
    }, [handleFetch, onClose]);

    return (
        <React.Fragment>
            <View style={styles.container}>
                <HeaderSection onPressNew={onPressNew} animatedValue={animatedValue} />
                <Animated.FlatList
                    refreshing={isLoading}
                    onRefresh={handleFetch}
                    data={templates}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                        useNativeDriver: true,
                    })}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    getItemLayout={getItemLayout}
                    ItemSeparatorComponent={Separator}
                    ListFooterComponent={renderFooter}
                    onMomentumScrollBegin={onMomentumScrollBegin}
                    onEndReached={handleFetchMore}
                    onEndReachedThreshold={0.5}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingTop: HEADER_HEIGHT + 10,
                        paddingHorizontal: 10,
                    }}
                />
            </View>
            <TemplateForm onSave={onSave} company={company} visible={visible} template={template} onClose={onClose} />
        </React.Fragment>
    );
});

export default Templates;
