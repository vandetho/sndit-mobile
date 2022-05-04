import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { PACKAGE } from '@workflows';
import { ROLES } from '@config';
import { DeliveredButton, GiveToDelivererButton, PrintButton, TakePackageButton } from './components';
import { Package } from '@interfaces';
import { useAuthentication } from '@contexts';
import Modal from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { GradientIcon, Text } from '@components';

const styles = StyleSheet.create({
    container: {
        height: 400,
    },
});

interface ActionButtonsProps {
    item: Package;
    visible: boolean;
    onDone: () => void;
    onPress: () => void;
    onClose: () => void;
}

const ActionButtons = React.memo<ActionButtonsProps>(({ item, visible, onDone, onPress, onClose }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const {
        jwt: { user },
    } = useAuthentication();

    const renderButtons = React.useCallback(() => {
        const buttons: JSX.Element[] = [];
        const keys = Object.keys(item.marking);
        if (keys.includes(PACKAGE.WAITING_FOR_DELIVERY)) {
            if (item.roles.includes(ROLES.MANAGER)) {
                buttons.push(
                    <GiveToDelivererButton
                        item={item}
                        onPress={onPress}
                        onDone={onDone}
                        key={`package-${item.id}-detail-button-give-to-deliverer`}
                    />,
                );
            }
            buttons.push(
                <TakePackageButton
                    item={item}
                    onPress={onPress}
                    onDone={onDone}
                    key={`package-${item.id}-detail-button-take-package`}
                />,
            );
        }
        if (
            keys.includes(PACKAGE.ON_DELIVERY) &&
            (item.roles.includes(ROLES.MANAGER) || (item.deliverer && user && item.deliverer.id === user.id))
        ) {
            buttons.push(
                <DeliveredButton
                    item={item}
                    onPress={onPress}
                    onDone={onDone}
                    key={`package-${item.id}-detail-button-delivered`}
                />,
            );
        }
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
        return <View>{buttons}</View>;
    }, [item, onDone, onPress, user]);

    return (
        <Modal
            isVisible={visible}
            hideModalContentWhileAnimating
            swipeDirection="down"
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            style={{ justifyContent: 'flex-end', margin: 0 }}
        >
            <View style={[styles.container, { backgroundColor: colors.card, borderRadius: 15 }]}>
                <View
                    style={{
                        marginVertical: 10,
                        borderRadius: 2,
                        height: 4,
                        backgroundColor: colors.text,
                        width: 75,
                        alignSelf: 'center',
                    }}
                />
                {renderButtons()}
                <TouchableWithoutFeedback onPress={onClose}>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 50,
                            width: 150,
                            height: 50,
                            borderRadius: 20,
                            backgroundColor: colors.background,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            alignSelf: 'center',
                        }}
                    >
                        <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
                        <GradientIcon name="times" />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
});

export default ActionButtons;
