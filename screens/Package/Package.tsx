import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { usePackage } from '@contexts';
import { ActionButtonRefProps, ActionButtons, PackageDetail, PackageHistory } from './components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

interface PackageProps {}

const Package = React.memo<PackageProps>(() => {
    const { item, onRefreshSelect, fetchPackages } = usePackage();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const onDone = React.useCallback(async () => {
        onRefreshSelect();
        fetchPackages();
        if (actionButtonsRef.current) {
            actionButtonsRef.current.dismiss();
        }
    }, [fetchPackages, onRefreshSelect]);

    const onOpen = React.useCallback(() => {
        if (actionButtonsRef.current) {
            actionButtonsRef.current.present();
        }
    }, []);

    return (
        <React.Fragment>
            <View style={styles.container}>
                <PackageDetail item={item} animatedValue={animatedValue} onPress={onOpen} />
                <PackageHistory
                    item={item}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
                        useNativeDriver: true,
                    })}
                />
            </View>
            <ActionButtons item={item} onDone={onDone} ref={actionButtonsRef} />
        </React.Fragment>
    );
});

export default Package;
