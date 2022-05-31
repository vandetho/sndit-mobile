import React from 'react';
import { Animated, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Button, GradientIcon, Text } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { PACKAGE } from '@workflows';
import { ROLES } from '@config';
import { DeliveredButton, GiveToDelivererButton, TakePackageButton } from './components';
import { useAuthentication } from '@contexts';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import Modal from 'react-native-modal';

interface ShowButtonsProps {
    animatedValue: Animated.Value;
    item: Package;
    onDone: () => void;
}

const ShowButtons = React.memo<ShowButtonsProps>(({ animatedValue, item, onDone }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const { visible, onToggle } = useVisible();
    const {
        jwt: { user },
    } = useAuthentication();

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.dismiss();
        }
    }, [visible]);

    const handleDone = React.useCallback(() => {
        onToggle();
        onDone();
    }, [onDone, onToggle]);

    const inputRange = React.useMemo<Array<number>>(() => [0, 350], []);

    const renderButtons = React.useCallback(() => {
        const buttons: JSX.Element[] = [];
        const keys = Object.keys(item.marking);
        if (keys.includes(PACKAGE.WAITING_FOR_DELIVERY) && item.roles.includes(ROLES.EMPLOYEE)) {
            if (item.roles.includes(ROLES.MANAGER)) {
                buttons.push(
                    <GiveToDelivererButton
                        item={item}
                        onDone={handleDone}
                        key={`package-${item.id}-detail-button-give-to-deliverer`}
                    />,
                );
            }
            buttons.push(
                <TakePackageButton
                    item={item}
                    onDone={handleDone}
                    key={`package-${item.id}-detail-button-take-package`}
                />,
            );
        }
        if (
            keys.includes(PACKAGE.ON_DELIVERY) &&
            (item.roles.includes(ROLES.MANAGER) || (item.deliverer && user && item.deliverer.id === user.id))
        ) {
            buttons.push(
                <DeliveredButton item={item} onDone={handleDone} key={`package-${item.id}-detail-button-delivered`} />,
            );
        }
        /*
        if (item.roles.includes(ROLES.MANAGER)) {
            buttons.push(
                <PrintButton
                    item={item}
                    onPress={onPress}
                    onDone={onDone}
                    key={`package-${item.id}-detail-button-print`}
                />,
            );
        }
        */
        return <React.Fragment>{buttons}</React.Fragment>;
    }, [handleDone, item, user]);

    return (
        <React.Fragment>
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 10],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Button label={t('show_buttons')} onPress={onToggle} style={{ margin: 10, borderRadius: 15 }} />
            </Animated.View>
            <Modal
                isVisible={visible}
                onBackdropPress={onToggle}
                swipeDirection={['down']}
                onSwipeComplete={onToggle}
                useNativeDriver
                hideModalContentWhileAnimating
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                }}
            >
                <View
                    style={{
                        height: '70%',
                        backgroundColor: colors.card,
                        borderRadius: 25,
                    }}
                >
                    <View
                        style={{
                            width: 75,
                            height: 5,
                            borderRadius: 3,
                            backgroundColor: colors.text,
                            marginVertical: 10,
                            alignSelf: 'center',
                        }}
                    />
                    <View
                        style={{
                            height: 150,
                            paddingTop: 10,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TouchableOpacity onPress={onToggle} style={{ flexDirection: 'row' }}>
                            <GradientIcon name="times" />
                            <Text bold style={{ marginHorizontal: 10 }}>
                                {t('close')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {renderButtons()}
                </View>
            </Modal>
        </React.Fragment>
    );
});

export default ShowButtons;
