import React from 'react';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const Backdrop = React.memo<BottomSheetBackdropProps>(({ animatedIndex, style }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    }));

    const containerStyle = React.useMemo(
        () => [
            style,
            {
                backgroundColor: '#000000AA',
            },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle],
    );

    return <Animated.View style={containerStyle} />;
});

export default Backdrop;
