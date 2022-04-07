import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { PALETTE } from '@theme';

const styles = StyleSheet.create({
    bar: {
        marginHorizontal: 2.5,
    },
});

interface BarLoaderProps {
    size?: number;
    color?: string;
    opacity?: Animated.Value;
}

const BarLoader: React.FunctionComponent<BarLoaderProps> = ({ size = 5, color = PALETTE.primary, opacity }) => {
    const firstBar = React.useRef(new Animated.Value(3)).current;
    const secondBar = React.useRef(new Animated.Value(1)).current;
    const thirdBar = React.useRef(new Animated.Value(1)).current;
    const fourthBar = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        const duration = 300;
        Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(firstBar, {
                        toValue: 1,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(secondBar, {
                        toValue: 3,
                        duration,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(secondBar, {
                        toValue: 1,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(thirdBar, {
                        toValue: 3,
                        duration,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(thirdBar, {
                        toValue: 1,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fourthBar, {
                        toValue: 3,
                        duration,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(fourthBar, {
                        toValue: 1,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(firstBar, {
                        toValue: 3,
                        duration,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ).start();
    }, [firstBar, fourthBar, secondBar, thirdBar]);

    return (
        <Animated.View style={[{ flexDirection: 'row' }, { opacity: opacity }]}>
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        transform: [{ scaleY: firstBar }],
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        transform: [{ scaleY: secondBar }],
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        transform: [{ scaleY: thirdBar }],
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.bar,
                    {
                        width: size,
                        height: size,
                        backgroundColor: color,
                        transform: [{ scaleY: fourthBar }],
                    },
                ]}
            />
        </Animated.View>
    );
};

export default BarLoader;
