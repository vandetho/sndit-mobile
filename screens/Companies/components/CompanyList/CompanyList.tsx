import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCompany } from '@contexts';
import { CARD_HEIGHT, CompanyCard, Separator, SEPARATOR_HEIGHT } from '@components';
import { Company } from '@interfaces';
import { HEADER_HEIGHT } from '../HeaderSection';
import { NewCompanyCard } from './components';

interface CompanyListProps {
    animatedValue: Animated.Value;
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onPressAddCompany: () => void;
}

const CompanyListComponent: React.FunctionComponent<CompanyListProps> = ({
    animatedValue,
    onScroll,
    onPressAddCompany,
}) => {
    const { t } = useTranslation();
    const { companies, isLoading } = useCompany();

    const renderItem = React.useCallback(
        ({ item }: { item: Company }) => {
            if (item.id === 0) {
                return <NewCompanyCard company={item} animatedValue={animatedValue} onPress={onPressAddCompany} />;
            }
            return <CompanyCard company={item} />;
        },
        [animatedValue, onPressAddCompany],
    );

    const keyExtractor = React.useCallback((_, index: number) => `companies-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({
            index,
            length: CARD_HEIGHT + SEPARATOR_HEIGHT,
            offset: (CARD_HEIGHT + SEPARATOR_HEIGHT) * index,
        }),
        [],
    );

    const data = React.useMemo<Array<Company>>(
        () => [{ name: t('add_company'), id: 0, token: '', roles: [] }, ...companies],
        [companies, t],
    );

    return (
        <Animated.FlatList
            refreshing={isLoading}
            data={data}
            onScroll={onScroll}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            ItemSeparatorComponent={Separator}
            scrollEventThrottle={16}
            contentContainerStyle={{
                paddingTop: HEADER_HEIGHT + 10,
                paddingHorizontal: 10,
            }}
        />
    );
};

const CompanyList = React.memo(CompanyListComponent);

export default CompanyList;
