import React from 'react';
import { Animated, View } from 'react-native';
import { useCompany } from '@contexts';
import { CARD_HEIGHT, CompanyCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Company } from '@interfaces';
import { EmptyCompany } from '@screens/NewPackage/components/CompanyList/components';

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
        <View style={{ flex: 1 }}>
            <Animated.FlatList
                refreshing={isLoading}
                data={companies}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListEmptyComponent={EmptyCompany}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10 }}
            />
        </View>
    );
};

const CompanyList = React.memo(CompanyListComponent);

export default CompanyList;
