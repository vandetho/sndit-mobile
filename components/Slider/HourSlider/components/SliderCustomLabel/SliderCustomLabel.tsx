import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@components/Text/Text';
import { LabelProps } from '@ptomasroos/react-native-multi-slider';

const SIZE = 50;
const styles = StyleSheet.create({
    sliderLabel: {
        position: 'absolute',
        justifyContent: 'center',
        top: 30,
        width: SIZE,
        height: SIZE,
    },
    sliderLabelText: {
        textAlign: 'center',
        lineHeight: SIZE,
        flex: 1,
    },
});

interface LabelBaseProps {
    position: number;
    value: string;
}

const LabelBase: React.FunctionComponent<LabelBaseProps> = (props) => {
    const { position, value } = props;

    return (
        <View
            style={[
                styles.sliderLabel,
                {
                    left: position - SIZE / 2,
                },
            ]}
        >
            <Text style={styles.sliderLabelText}>{value}</Text>
        </View>
    );
};

interface SliderCustomLabelProps extends LabelProps {}

const SliderCustomLabel = React.memo<SliderCustomLabelProps>((props) => {
    const { oneMarkerValue, twoMarkerValue, oneMarkerLeftPosition, twoMarkerLeftPosition } = props;

    const textTransformerTimes = React.useCallback((value) => {
        const decimal = value % 1;
        let hours: number | string = value - decimal;
        let minute: number | string = decimal * 60;
        if (minute === 0) {
            minute = `0${minute}`;
        }
        if (hours < 10) {
            hours = `0${hours}`;
        }
        return `${hours}:${minute}`;
    }, []);

    return (
        <View>
            <LabelBase position={oneMarkerLeftPosition} value={textTransformerTimes(oneMarkerValue)} />
            {twoMarkerValue ? (
                <LabelBase position={twoMarkerLeftPosition} value={textTransformerTimes(twoMarkerValue)} />
            ) : null}
        </View>
    );
});

export default SliderCustomLabel;
