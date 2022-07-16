import React from 'react';
import { Text, TextProps } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { Point } from 'react-native-svg/lib/typescript/elements/Shape';
import { CustomLinearGradient } from '../CustomLinearGradient';

interface GradientTextProps extends TextProps {
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    colors?: string[];
    start?: Point | null;
    end?: Point | null;
}

const GradientText: React.FunctionComponent<GradientTextProps> = ({
    colors,
    end,
    start,
    bold = false,
    italic = false,
    fontSize = 14,
    ...props
}) => {
    const fontFamily = React.useMemo(() => {
        if (bold && italic) {
            return 'Rubik_900Black_Italic';
        }
        if (bold) {
            return 'Rubik_900Black';
        }
        if (italic) {
            return 'Rubik_400Regular_Italic';
        }
        return 'Rubik_400Regular';
    }, [bold, italic]);
    return (
        <MaskedView
            maskElement={
                <Text
                    {...props}
                    style={[
                        props.style,
                        {
                            fontSize,
                            fontFamily,
                        },
                    ]}
                />
            }
        >
            <CustomLinearGradient colors={colors} start={start} end={end} style={{ width: '100%' }}>
                <Text {...props} style={[props.style, { opacity: 0 }]} />
            </CustomLinearGradient>
        </MaskedView>
    );
};

export default GradientText;
