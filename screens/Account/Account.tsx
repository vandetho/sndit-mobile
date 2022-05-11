import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useAuthentication } from '@contexts';
import { ITEM_HEIGHT, SettingItem, TOP_SECTION_HEIGHT, TopSection } from './components';
import { MenuItem } from '@interfaces';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContentContainer: {
        flexGrow: 1,
        paddingTop: TOP_SECTION_HEIGHT,
        paddingBottom: 1000,
    },
});

interface AccountProps {}

const Account = React.memo<AccountProps>(() => {
    const { t } = useTranslation();
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const {
        jwt: { user },
    } = useAuthentication();

    const data = React.useMemo<MenuItem[]>(
        () => [
            {
                icon: 'phone',
                key: 'phone-number',
                text: t('phone_number'),
                screen: 'PhoneNumber',
            },
            {
                icon: 'user',
                key: 'user-information',
                text: t('information'),
                screen: 'UserInformation',
            },
        ],
        [t],
    );

    const renderItem = React.useCallback(({ item }: { item: MenuItem }) => <SettingItem item={item} />, []);

    const keyExtractor = React.useCallback((_, index: number) => `setting-item-${index}`, []);

    const getItemLayout = React.useCallback(
        (_, index: number) => ({ index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index }),
        [],
    );

    return (
        <View style={styles.container}>
            <TopSection user={user} animatedValue={scrollY} />
            <Animated.FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
                    useNativeDriver: true,
                })}
                contentContainerStyle={styles.listContentContainer}
            />
        </View>
    );
});

export default Account;
