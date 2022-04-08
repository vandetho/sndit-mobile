import React from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, TouchableWithoutFeedback, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
import { useCompany } from '@contexts';
import { GradientIcon, GradientText, Separator, SEPARATOR_HEIGHT } from '@components';
import { Company } from '@interfaces';
import { CARD_HEIGHT, CompanyCard } from './components';
import { HEADER_HEIGHT } from '../HeaderSection';

interface CompanyListProps {
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onPressAddCompany: () => void;
}

const CompanyListComponent: React.FunctionComponent<CompanyListProps> = ({ onScroll, onPressAddCompany }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { companies, isLoading } = useCompany();

    const renderItem = React.useCallback(
        ({ item }: { item: Company }) => {
            if (item.id === 0) {
                return (
                    <TouchableWithoutFeedback onPress={onPressAddCompany}>
                        <View
                            style={{
                                height: CARD_HEIGHT,
                                borderRadius: 15,
                                flexDirection: 'row',
                                backgroundColor: colors.card,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <GradientIcon name="plus" />
                            <GradientText fontSize={16} bold style={{ marginLeft: 10 }}>
                                {item.name}
                            </GradientText>
                        </View>
                    </TouchableWithoutFeedback>
                );
            }
            return <CompanyCard company={item} />;
        },
        [colors.card, onPressAddCompany],
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
            contentContainerStyle={{ paddingTop: HEADER_HEIGHT, paddingHorizontal: 10 }}
        />
    );
};

const CompanyList = React.memo(CompanyListComponent);

export default CompanyList;
