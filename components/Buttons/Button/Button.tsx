import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { gradientColor, PALETTE } from '@theme';
import { BarLoader } from '@components/Loader';
import { CustomLinearGradient } from '@components/Gradient';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 40,
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
                return <BarLoader color={color} />;
            }
            return (
                <>
                    {renderStartIcon()}
                    <Text style={{ color, marginHorizontal: 10 }}>{label}</Text>
                    {renderEndIcon()}
                </>
            );
        }, [color, isLoading, label, renderEndIcon, renderStartIcon]);

        return (
            <TouchableOpacity disabled={isLoading} onPress={handlePress}>
                <CustomLinearGradient
                    colors={backgroundColor}
                    style={[styles.container, { borderRadius: radius }, style]}
                >
                    {renderContent()}
                </CustomLinearGradient>
            </TouchableOpacity>
        );
    },
);

export default Button;
