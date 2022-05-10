import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { PALETTE } from '@theme';

const borderWidth = 3;

const styles = StyleSheet.create({
    maskViewBlockContainer: {
        flex: 1,
    },
    maskViewBlockContainerRow: {
        flex: 1,
        flexDirection: 'row',
    },
    maskViewBlock: {
        flex: 1,
    },
    maskViewBlockWithBorderLeftTop: {
        flex: 1,
        borderLeftWidth: borderWidth,
        borderTopWidth: borderWidth,
        borderColor: PALETTE.primary,
        borderTopStartRadius: 15,
    },
    maskViewBlockWithBorderLeftBottom: {
        flex: 1,
        borderLeftWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderColor: PALETTE.primary,
        borderBottomStartRadius: 15,
    },
    maskViewBlockWithBorderRightTop: {
        flex: 1,
        borderRightWidth: borderWidth,
        borderTopWidth: borderWidth,
        borderColor: PALETTE.primary,
        borderTopEndRadius: 15,
    },
    maskViewBlockWithBorderRightBottom: {
        flex: 1,
        borderRightWidth: borderWidth,
        borderBottomWidth: borderWidth,
        borderColor: PALETTE.primary,
        borderBottomEndRadius: 15,
    },
});

interface ScannerMaskProps {
    visible: boolean;
    bounds: { top: number; left: number; width: number; height: number };
    isLoading?: boolean;
}

const ScannerMask: React.FC<ScannerMaskProps> = ({ visible, bounds, isLoading }) => {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, { toValue: 1, useNativeDriver: true }),
                    Animated.timing(animatedValue, { toValue: 0, useNativeDriver: true }),
                ]),
            ).start();
        }
    }, [animatedValue, visible]);

    const renderLoader = React.useCallback(() => {
        if (isLoading) {
            return (
                <Animated.View
                    style={{
                        position: 'absolute',
                        left: -10,
                        right: -10,
                        height: 2,
                        backgroundColor: PALETTE.primary,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, bounds.height],
                                }),
                            },
                        ],
                    }}
                />
            );
        }
        return null;
    }, [animatedValue, bounds.height, isLoading]);

    if (visible) {
        const { top, left, width, height } = bounds;

        return (
            <View
                style={{
                    position: 'absolute',
                    top,
                    left,
                }}
            >
                <Animated.View
                    style={[
                        {
                            width,
                            height,
                        },
                        !isLoading && {
                            transform: [
                                {
                                    scale: animatedValue.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.2],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <View style={styles.maskViewBlockContainerRow}>
                        <View style={styles.maskViewBlockWithBorderLeftTop} />
                        <View style={styles.maskViewBlock} />
                        <View style={styles.maskViewBlockWithBorderRightTop} />
                    </View>
                    <View style={styles.maskViewBlockContainer} />
                    <View style={styles.maskViewBlockContainerRow}>
                        <View style={styles.maskViewBlockWithBorderLeftBottom} />
                        <View style={styles.maskViewBlock} />
                        <View style={styles.maskViewBlockWithBorderRightBottom} />
                    </View>
                </Animated.View>
                {renderLoader()}
            </View>
        );
    }

    return null;
};

export default ScannerMask;
