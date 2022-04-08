import React from 'react';
import { Animated } from 'react-native';
import { useCompany } from '@contexts';
import { CARD_HEIGHT, CompanyCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Company } from '@interfaces';

interface CompanyListProps {
    onPress: (company: Company) => void;
}

const CompanyListComponent: React.FunctionComponent<CompanyListProps> = ({ onPress }) => {
    const { companies, isLoading } = useCompany();

    const renderItem = React.useCallback(
        ({ item }: { item: Company }) => {
            return <CompanyCard company={item} onPress={onPress} />;
        },
        [onPress],
    );

    const keyExtractor = React.useCallback((_, index: number) => `companies-picker-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: CARD_HEIGHT + SEPARATOR_HEIGHT,
            offset: (CARD_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    return (
        <Animated.FlatList
            refreshing={isLoading}
            data={companies}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            contentContainerStyle={{ paddingHorizontal: 10 }}
        />
    );
};

const CompanyList = React.memo(CompanyListComponent);

export default CompanyList;
