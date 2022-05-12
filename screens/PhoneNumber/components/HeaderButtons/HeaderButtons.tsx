import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useIsFocused, useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
});

interface HeaderButtonsProps {}

const HeaderButtonsComponent: React.FunctionComponent<HeaderButtonsProps> = () => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (isFocused) {
            Animated.spring(animatedValue, { toValue: 1, useNativeDriver: true, delay: 100 }).start();
        }
    }, [animatedValue, isFocused]);

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={{ marginTop: insets.top, marginBottom: 20, width, paddingHorizontal: 10, zIndex: 2 }}>
            <Animated.View
                style={{
                    width: 100,
                    opacity: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                    transform: [
                        {
                            translateX: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [100, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                    onPress={handleGoBack}
                >
                    <GradientIcon name="chevron-left" />
                    <Text style={{ marginHorizontal: 10 }}>{t('back')}</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const HeaderButtons = React.memo(HeaderButtonsComponent);

export default HeaderButtons;
