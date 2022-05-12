import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Button, Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { HeaderButton } from '../ActionButtons/components';

export const HEADER_HEIGHT = 310;

const styles = StyleSheet.create({
    container: {
        height: HEADER_HEIGHT,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
});

interface PackageDetailProps {
    animatedValue: Animated.Value;
    item: Package;
    onShowButton: () => void;
}

const PackageDetailComponent: React.FunctionComponent<PackageDetailProps> = ({ animatedValue, item, onShowButton }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const inputRange = React.useMemo<Array<number>>(() => [0, HEADER_HEIGHT], []);
    const height = React.useMemo(() => (item.address ? HEADER_HEIGHT : HEADER_HEIGHT + 10), [item.address]);

    const renderMarking = React.useCallback(
        () => (
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, height],
                                extrapolate: 'clamp',
                            }),
                        },
                        {
                            translateX: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 210],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                {Object.keys(item.marking).map((marking, index) => (
                    <Text key={`package-${item.id}-marking-${index}`}>{t(marking)}</Text>
                ))}
            </Animated.View>
        ),
        [animatedValue, height, inputRange, item.id, item.marking, t],
    );

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -50],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                },
            ]}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: colors.card,
                    height: HEADER_HEIGHT - 120,
                    opacity: animatedValue.interpolate({
                        inputRange,
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                    }),
                }}
            />
            <Animated.View
                style={{
                    marginTop: 10,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    zIndex: 1,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 50],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <HeaderButton item={item} />
            </Animated.View>
            <Animated.View
                style={{
                    padding: 10,
                    borderRadius: 15,
                    justifyContent: 'space-between',
                    backgroundColor: colors.card,
                    marginHorizontal: 10,
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, -350],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Animated.Text
                    style={{
                        color: colors.text,
                        fontFamily: 'Rubik_900Black',
                        fontSize: 16,
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, 380],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    {item.name}
                </Animated.Text>
                <Text>{item.address}</Text>
                {item.city && <Text>{item.city.name}</Text>}
                {renderMarking()}
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        transform: [
                            {
                                translateY: animatedValue.interpolate({
                                    inputRange,
                                    outputRange: [0, -250],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >
                    <View>
                        <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                            {t('created_by')}
                        </Text>
                        <Text>
                            {item.creator.lastName} {item.creator.firstName}
                        </Text>
                    </View>
                    {item.deliverer && (
                        <View>
                            <Text bold fontSize={12} style={{ marginVertical: 5 }}>
                                {t('delivered_by')}
                            </Text>
                            <Text>
                                {item.deliverer.lastName} {item.deliverer.firstName}
                            </Text>
                        </View>
                    )}
                </Animated.View>
            </Animated.View>
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, height - 420],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Button label={t('show_buttons')} onPress={onShowButton} style={{ margin: 10, borderRadius: 15 }} />
            </Animated.View>
        </Animated.View>
    );
};

const PackageDetail = React.memo(PackageDetailComponent);

export default PackageDetail;
