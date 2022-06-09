import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { usePackage } from '@contexts';
import { PackageDetail, PackageHistory, PackageHistoryRefProps } from './components';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ApplicationStackParamsList } from '@navigations';
import { usePackageFetcher } from '@fetchers';
import { BarLoader } from '@components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

type PackageScreenRouteProp = RouteProp<ApplicationStackParamsList, 'Package'>;

interface PackageProps {}

const Package = React.memo<PackageProps>(() => {
    const { item, onRefreshSelect, fetchPackages, onSelect } = usePackage();
    const { item: pkg, fetch, isLoading } = usePackageFetcher();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const packageHistoryRef = React.useRef<PackageHistoryRefProps>(null);
    const { params } = useRoute<PackageScreenRouteProp>();

    React.useEffect(() => {
        if (!isLoading && !item && params?.token) {
            fetch(params.token);
        }
    }, [fetch, isLoading, item, params, pkg]);

    React.useEffect(() => {
        if (!isLoading && pkg) {
            onSelect(pkg);
        }
    }, [isLoading, onSelect, pkg]);

    const onDone = React.useCallback(async () => {
        onRefreshSelect();
        fetchPackages();
        if (packageHistoryRef.current) {
            packageHistoryRef.current.refresh();
        }
    }, [fetchPackages, onRefreshSelect]);

    if (isLoading && item) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <BarLoader />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <BarLoader />
            </View>
        );
    }

    return (
        <React.Fragment>
            <View style={styles.container}>
                <PackageDetail item={item} animatedValue={animatedValue} onPress={onDone} />
                <PackageHistory
                    item={item}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                        useNativeDriver: true,
                    })}
                    ref={packageHistoryRef}
                />
            </View>
        </React.Fragment>
    );
});

export default Package;
