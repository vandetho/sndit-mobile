import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { gradientColor, PALETTE } from '@theme';
import { BarLoader } from '@components/Loader';
import { CustomLinearGradient } from '@components/Gradient';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

interface ButtonProps {
    shape?: 'rectangle' | 'square';
    type?: 'error' | 'success' | 'primary' | 'secondary' | 'warning';
    label: string;
    textColor?: string;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    isLoading?: boolean;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

const Button = React.memo<ButtonProps>(
    ({ shape = 'rectangle', label, textColor, startIcon, endIcon, isLoading, type = 'primary', style, onPress }) => {
        const handlePress = React.useCallback(() => {
            if (onPress) {
                onPress();
            }
        }, [onPress]);

        const renderStartIcon = React.useCallback(() => {
            if (startIcon) {
                return startIcon;
            }
            return null;
        }, [startIcon]);

        const renderEndIcon = React.useCallback(() => {
            if (endIcon) {
                return endIcon;
            }
            return null;
        }, [endIcon]);

        const radius = React.useMemo<number>(() => {
            const radius = {
                rectangle: 0,
                shape: 10,
            };

            return radius[shape];
        }, [shape]);

        const backgroundColor = React.useMemo(() => {
            const backgroundColors = {
                error: gradientColor.redPink,
                success: gradientColor.green,
                warning: gradientColor.amberAmber,
                secondary: gradientColor.indigoPurple,
                primary: [PALETTE.primary, PALETTE.secondary],
            };
            return backgroundColors[type];
        }, [type]);

        const color = React.useMemo(() => {
            const colors = { error: '#FFFFFF', success: '#FFFFFF', primary: '#FFFFFF', secondary: '#FFFFFF' };
            return textColor || colors[type];
        }, [textColor, type]);

        const renderContent = React.useCallback(() => {
            if (isLoading) {
                return (
                    <View style={[styles.container, { borderRadius: radius }]}>
                        <BarLoader color={color} />
                    </View>
                );
            }
            return (
                <CustomLinearGradient
                    colors={backgroundColor}
                    style={[styles.container, { borderRadius: radius }, style]}
                >
                    {renderStartIcon()}
                    <Text style={{ color, marginHorizontal: 10 }}>{label}</Text>
                    {renderEndIcon()}
                </CustomLinearGradient>
            );
        }, [backgroundColor, color, isLoading, label, radius, renderEndIcon, renderStartIcon, style]);

        return <TouchableOpacity onPress={handlePress}>{renderContent()}</TouchableOpacity>;
    },
);

export default Button;
