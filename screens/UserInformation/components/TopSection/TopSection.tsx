import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { HeaderButtons } from './components';

export const TOP_SECTION_HEIGHT = 100;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: TOP_SECTION_HEIGHT,
        alignItems: 'center',
        zIndex: 2,
    },
});
interface TopSectionProps {
    animatedValue: Animated.Value;
}

const TopSection = React.memo<TopSectionProps>(({ animatedValue }) => {
    const { colors } = useTheme();

    return (
        <Animated.View style={styles.container}>
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: TOP_SECTION_HEIGHT,
                    backgroundColor: colors.card,
                    zIndex: 1,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, TOP_SECTION_HEIGHT],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                }}
            />
            <HeaderButtons />
        </Animated.View>
    );
});

export default TopSection;
