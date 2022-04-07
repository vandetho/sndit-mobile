import React from 'react';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { SliderCustomLabel } from './components';
import { StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';

const MIN = 0;
const MAX = 24;

const styles = StyleSheet.create({
    trackStyle: {
        height: 10,
        borderRadius: 8,
    },
});

interface HourSliderProps {
    double?: boolean;
    trackStyle?: ViewStyle;
}

const HourSlider = React.memo<HourSliderProps>(({ double = false, trackStyle = styles.trackStyle }) => {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const [selected, setSelected] = React.useState(() => (double ? [MIN, MAX] : [MIN]));

    const onValuesChangeFinish = React.useCallback((values) => {
        setSelected(values);
    }, []);

    const selectedStyle = React.useMemo(
        () => ({
            backgroundColor: double ? colors.background : colors.primary,
        }),
        [colors.background, colors.primary, double],
    );

    const unselectedStyle = React.useMemo(
        () => ({
            backgroundColor: double ? colors.primary : colors.background,
        }),
        [colors.background, colors.primary, double],
    );

    return (
        <MultiSlider
            min={MIN}
            max={MAX}
            allowOverlap
            values={selected}
            sliderLength={width}
            onValuesChangeFinish={onValuesChangeFinish}
            enableLabel={true}
            customLabel={SliderCustomLabel}
            trackStyle={trackStyle}
            markerOffsetY={3}
            selectedStyle={selectedStyle}
            unselectedStyle={unselectedStyle}
        />
    );
});

export default HourSlider;
