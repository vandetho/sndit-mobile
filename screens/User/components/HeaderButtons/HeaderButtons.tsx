import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { User } from '@interfaces';
import { AVATAR_SIZE } from '../UserAvatar';

const BUTTON_HEIGHT = 40;
const SECTION_HEIGHT = 60;
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

interface HeaderButtonsProps {
    user: User;
    scrollY: Animated.Value;
}

const HeaderButtonsComponent: React.FunctionComponent<HeaderButtonsProps> = ({ scrollY, user }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);
    return (
        <View
            style={{
                flexDirection: 'row',
                padding: 10,
                left: 0,
                right: 0,
                position: 'absolute',
                zIndex: 2,
                height: SECTION_HEIGHT,
            }}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: SECTION_HEIGHT,
                    backgroundColor: colors.card,
                    opacity: scrollY.interpolate({
                        inputRange: [0, AVATAR_SIZE],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                }}
            />
            <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: colors.card }]} onPress={handleGoBack}>
                <GradientIcon name="times" />
                <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
            </TouchableOpacity>
            <Animated.View
                style={{
                    marginLeft: 25,
                    alignSelf: 'center',
                    transform: [
                        {
                            translateY: scrollY.interpolate({
                                inputRange: [0, AVATAR_SIZE],
                                outputRange: [155, 0],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Text bold>
                    {user.lastName} {user.firstName}
                </Text>
            </Animated.View>
        </View>
    );
};

const HeaderButtons = React.memo(HeaderButtonsComponent);

export default HeaderButtons;
