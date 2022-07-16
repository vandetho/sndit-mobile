import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Point } from 'react-native-svg/lib/typescript/elements/Shape';
import { CustomLinearGradient } from '../CustomLinearGradient';

interface GradientIconProps {
    name: any;
    colors?: string[];
    start?: Point | null;
    end?: Point | null;
    size?: number;
    iconFamily?: 'material' | 'fontawesome';
    style?: TextStyle | ViewStyle;
}

const GradientIcon: React.FunctionComponent<GradientIconProps> = ({
    colors,
    iconFamily = 'fontawesome',
    end,
    start,
    size = 24,
    ...props
}) => {
    const Component = React.useMemo(() => (iconFamily === 'fontawesome' ? FontAwesome5 : MaterialIcons), [iconFamily]);

    return (
        <MaskedView maskElement={<Component size={size} {...props} />}>
            <CustomLinearGradient colors={colors} start={start} end={end}>
                <Component size={size} {...props} style={[props.style, { opacity: 0 }]} />
            </CustomLinearGradient>
        </MaskedView>
    );
};

export default GradientIcon;
