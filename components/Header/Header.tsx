import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { GradientIcon } from '@components/Gradient';
import { BarLoader } from '@components/Loader';
import { Text } from '@components/Text';
import { useNavigation, useTheme } from '@react-navigation/native';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PADDING,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
    },
});

interface HeaderProps {
    headerRightIcon?: string;
    headerRightTitle?: string;
    headerRightSize?: number;
    goBackIcon?: string;
    goBackSize?: number;
    goBackTitle?: string;
    disabledBack?: boolean;
    loadingRightButton?: boolean;
    onGoBack?: () => void;
    onRightButtonPress?: (data?: any) => void;
    containerStyle?: StyleProp<ViewStyle>;
}

const Header = React.memo<HeaderProps>(
    ({
        headerRightIcon,
        headerRightTitle,
        headerRightSize,
        goBackIcon = 'chevron-left',
        goBackTitle,
        goBackSize,
        disabledBack = false,
        loadingRightButton = false,
        onGoBack,
        containerStyle,
        onRightButtonPress,
    }) => {
        const { colors } = useTheme();
        const navigation = useNavigation();

        const handleGoBack = React.useCallback(() => {
            if (!disabledBack) {
                if (onGoBack) {
                    return onGoBack();
                }
                navigation.goBack();
            }
        }, [disabledBack, navigation, onGoBack]);

        const renderRightButtonContent = React.useCallback(() => {
            if (loadingRightButton) {
                return <BarLoader />;
            }
            const content = [];
            if (headerRightTitle) {
                content.push(
                    <Text style={{ marginHorizontal: 10 }} key="header-right-button-text">
                        {headerRightTitle}
                    </Text>,
                );
            }
            if (headerRightIcon) {
                content.push(
                    <GradientIcon size={headerRightSize} name={headerRightIcon} key="header-right-button-icon" />,
                );
            }
            return content;
        }, [headerRightIcon, headerRightSize, headerRightTitle, loadingRightButton]);

        return (
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, containerStyle]}>
                <TouchableOpacity
                    disabled={disabledBack}
                    style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                    onPress={handleGoBack}
                >
                    <GradientIcon name={goBackIcon} size={goBackSize} />
                    {goBackTitle && <Text style={{ marginHorizontal: 10 }}>{goBackTitle}</Text>}
                </TouchableOpacity>
                {onRightButtonPress && (
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                        onPress={onRightButtonPress}
                    >
                        {renderRightButtonContent()}
                    </TouchableOpacity>
                )}
            </View>
        );
    },
);

export default Header;
