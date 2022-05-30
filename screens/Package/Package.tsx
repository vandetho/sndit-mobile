import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { usePackage } from '@contexts';
import { PackageDetail, PackageHistory, PackageHistoryRefProps } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface PackageProps {}

const Package = React.memo<PackageProps>(() => {
    const { item, onRefreshSelect, fetchPackages } = usePackage();
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const packageHistoryRef = React.useRef<PackageHistoryRefProps>(null);

    const onDone = React.useCallback(async () => {
        onRefreshSelect();
        fetchPackages();
    }, [fetchPackages, onRefreshSelect]);

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
