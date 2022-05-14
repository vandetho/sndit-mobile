import React from 'react';
import { useTheme } from '@react-navigation/native';
import { Text as RNText, TextProps as NSTextProps } from 'react-native';

interface TextProps extends NSTextProps {
    color?: string;
    bold?: boolean;
    italic?: boolean;
    disabled?: boolean;
    fontSize?: number;
}

const Text = React.memo<TextProps>((props) => {
    const { colors } = useTheme();
    const { color = colors.text, bold = false, italic = false, disabled = false, fontSize = 14, ...rest } = props;

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

    const finalColor = React.useMemo(() => (disabled ? colors.border : color), [color, colors.border, disabled]);

    return (
        <RNText
            {...rest}
            style={[
                {
                    color: finalColor,
                    fontSize,
                    fontFamily,
                },
                props.style,
            ]}
        >
            {props.children}
        </RNText>
    );
});

export default Text;
