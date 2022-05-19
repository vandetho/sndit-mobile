import React from 'react';
import { useCompany } from '@contexts';
import { useTemplatesFetcher } from '@fetchers';
import { Animated, StyleSheet, View } from 'react-native';
import { TemplateCard } from '@components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {},
});

interface TemplatesProps {}

const Templates = React.memo<TemplatesProps>(() => {
    const { company } = useCompany();
    const { templates, isLoading, isLoadingMore, fetch, fetchMore } = useTemplatesFetcher();
    const handleFetch = React.useCallback(async () => {
        await fetch(company);
    }, [company, fetch]);
    React.useEffect(() => {
        handleFetch();
    }, [handleFetch]);
    const renderItem = React.useCallback(({ item }) => <TemplateCard template={item} />, []);
    return (
        <View style={styles.container}>
            <HeaderSection />
            <Animated.FlatList data={templates} renderItem={renderItem} />
        </View>
    );
});

export default Templates;
