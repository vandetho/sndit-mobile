import React from 'react';
import { Animated, GestureResponderEvent, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PALETTE } from '@theme';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ScannerButton } from './components';

const TAB_HEIGHT = 75;
const ICON_SIZE = 24;

interface BottomTabButtonProps {
    iconName: IconName;
    label: string;
    isFocused: boolean;
    onPress?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void;
}

const BottomTabButton: React.FunctionComponent<BottomTabButtonProps> = ({ iconName, label, isFocused, onPress }) => {
    const viewTranslate = React.useRef(new Animated.Value(-10)).current;
    const textTranslate = React.useRef(new Animated.Value(1)).current;
    const textScale = React.useRef(new Animated.Value(1)).current;
    const textOpacity = React.useRef(new Animated.Value(1)).current;
    const { colors } = useTheme();

    const speed = 30;

    React.useEffect(() => {
        if (isFocused) {
            Animated.parallel([
                Animated.spring(viewTranslate, { toValue: -5, useNativeDriver: true, speed }),
                Animated.spring(textScale, { toValue: 1, useNativeDriver: true, speed }),
                Animated.spring(textOpacity, { toValue: 1, useNativeDriver: true, speed }),
                Animated.spring(textTranslate, { toValue: -5, useNativeDriver: true, speed }),
            ]).start();
            return;
        }

        Animated.parallel([
            Animated.spring(viewTranslate, { toValue: 0, useNativeDriver: true, speed }),
            Animated.spring(textScale, { toValue: 0.5, useNativeDriver: true, speed }),
            Animated.spring(textOpacity, { toValue: 0, useNativeDriver: true, speed }),
            Animated.spring(textTranslate, { toValue: 0, useNativeDriver: true, speed }),
        ]).start();
    }, [isFocused, textOpacity, textScale, textTranslate, viewTranslate]);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: TAB_HEIGHT,
                    width: 50,
                }}
            >
                <Animated.View style={{ transform: [{ translateY: viewTranslate }] }}>
                    <FontAwesome5 name={iconName} size={ICON_SIZE} color={isFocused ? PALETTE.primary : colors.text} />
                </Animated.View>
                <Animated.Text
                    style={{
                        color: PALETTE.primary,
                        fontFamily: 'Rubik_400Regular',
                        fontSize: 10,
                        opacity: textOpacity,
                        transform: [{ scale: textScale }, { translateY: textTranslate }],
                    }}
                >
                    {label}
                </Animated.Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

type IconName = 'home' | 'box' | 'store' | 'cog' | '';

const BottomTabBarComponent: React.FunctionComponent<BottomTabBarProps> = ({ navigation, state, descriptors }: any) => {
    const icons: Array<IconName> = React.useMemo(() => ['home', 'box', '', 'store', 'cog'], []);
    const { colors } = useTheme();

    const renderIcons = React.useCallback(
        () =>
            state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];

                const isFocused = state.index === index;

                if (route.name === 'QrCodeScanner') {
                    return <ScannerButton key={`bottom-tab-${index}`} />;
                }

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                return (
                    <BottomTabButton
                        onPress={onPress}
                        label={options.tabBarLabel}
                        iconName={icons[index]}
                        isFocused={isFocused}
                        key={`bottom-tab-${index}`}
                    />
                );
            }),
        [descriptors, icons, navigation, state.index, state.routes],
    );

    return (
        <View style={{ height: TAB_HEIGHT, flexDirection: 'row', backgroundColor: colors.card }}>{renderIcons()}</View>
    );
};

const BottomTabBar = React.memo(BottomTabBarComponent);

export default BottomTabBar;
