import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useCompany } from '@contexts';
import { GradientIcon } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';

export const HEADER_HEIGHT = 120;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: HEADER_HEIGHT,
        top: 0,
        left: 0,
        right: 0,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'flex-end',
        zIndex: 1,
    },
});
type NewPackageNavigationProp = StackNavigationProp<ApplicationStackParamsList, 'NewPackage'>;

interface HeaderSectionProps {
    animatedValue: Animated.Value;
}

const HeaderSectionComponent: React.FunctionComponent<HeaderSectionProps> = ({ animatedValue }) => {
    const { colors } = useTheme();
    const { managerCompanies } = useCompany();
    const { onSelect } = useCompany();
    const navigation = useNavigation<NewPackageNavigationProp>();

    const inputRange = React.useMemo(() => [0, HEADER_HEIGHT], []);

    const onPressNewPackage = React.useCallback(() => {
        onSelect(undefined);
        navigation.navigate('NewPackage');
    }, [navigation, onSelect]);

    const renderNewPackageButton = React.useCallback(() => {
        if (managerCompanies.length > 0) {
            return (
                <Animated.View
                    style={{
                        marginRight: 10,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, -30],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    <TouchableOpacity onPress={onPressNewPackage}>
                        <GradientIcon name="plus" />
                    </TouchableOpacity>
                </Animated.View>
            );
        }
        return null;
    }, [animatedValue, inputRange, managerCompanies.length, onPressNewPackage]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: HEADER_HEIGHT - 20,
                    backgroundColor: colors.card,
                    opacity: animatedValue.interpolate({
                        inputRange,
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                }}
            />
            <Animated.Text
                style={{
                    color: colors.primary,
                    fontFamily: 'Rubik_900Black',
                    fontSize: 24,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -25],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            translateX: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 10],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            scale: animatedValue.interpolate({
                                inputRange,
                                outputRange: [1, 0.75],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                Sndit
            </Animated.Text>
            {renderNewPackageButton()}
        </View>
    );
};

const HeaderSection = React.memo(HeaderSectionComponent);

export default HeaderSection;
