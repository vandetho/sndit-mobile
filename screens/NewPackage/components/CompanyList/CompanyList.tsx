import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useCompany } from '@contexts';
import { CARD_HEIGHT, CompanyCard, Header, Separator, SEPARATOR_HEIGHT } from '@components';
import { Company } from '@interfaces';
import { EmptyCompany } from '@screens/NewPackage/components/CompanyList/components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';

const HEADER_HEIGHT = 100;

const styles = StyleSheet.create({
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height: HEADER_HEIGHT,
    },
});

interface CompanyListProps {
    onPress: (company: Company) => void;
}

const CompanyListComponent: React.FunctionComponent<CompanyListProps> = ({ onPress }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
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

    const inputRange = React.useMemo<Array<number>>(() => [0, HEADER_HEIGHT], []);

    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={styles.headerContainer}>
                <Animated.View
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        height: HEADER_HEIGHT,
                        backgroundColor: colors.card,
                        opacity: animatedValue.interpolate({ inputRange, outputRange: [0, 1], extrapolate: 'clamp' }),
                    }}
                />
                <Header goBackTitle={t('close')} goBackIcon="times" />
            </Animated.View>
            <Animated.FlatList
                refreshing={isLoading}
                data={companies}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListEmptyComponent={EmptyCompany}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={Separator}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingTop: HEADER_HEIGHT }}
            />
        </View>
    );
};

const CompanyList = React.memo(CompanyListComponent);

export default CompanyList;
