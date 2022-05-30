import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { PACKAGE } from '@workflows';
import { ROLES } from '@config';
import { DeliveredButton, GiveToDelivererButton, TakePackageButton } from './components';
import { Package } from '@interfaces';
import { useAuthentication } from '@contexts';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { GradientIcon, Text } from '@components';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ActionButtonsProps {
    item: Package;
    visible: boolean;
    onDone: () => void;
    onClose: () => void;
}

const ActionButtons = React.memo<ActionButtonsProps>(({ item, visible, onDone, onClose }) => {
    const { colors } = useTheme();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const { t } = useTranslation();
    const {
        jwt: { user },
    } = useAuthentication();

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.close();
        }
    }, [visible]);

    const snapPoints = React.useMemo(() => ['50%', '75%'], []);

    const renderButtons = React.useCallback(() => {
        const buttons: JSX.Element[] = [];
        const keys = Object.keys(item.marking);
        if (keys.includes(PACKAGE.WAITING_FOR_DELIVERY) && item.roles.includes(ROLES.EMPLOYEE)) {
            if (item.roles.includes(ROLES.MANAGER)) {
                buttons.push(
                    <GiveToDelivererButton
                        item={item}
                        onDone={onDone}
                        key={`package-${item.id}-detail-button-give-to-deliverer`}
                    />,
                );
            }
            buttons.push(
                <TakePackageButton item={item} onDone={onDone} key={`package-${item.id}-detail-button-take-package`} />,
            );
        }
        if (
            keys.includes(PACKAGE.ON_DELIVERY) &&
            (item.roles.includes(ROLES.MANAGER) || (item.deliverer && user && item.deliverer.id === user.id))
        ) {
            buttons.push(
                <DeliveredButton item={item} onDone={onDone} key={`package-${item.id}-detail-button-delivered`} />,
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
    }, [item, onDone, user]);

    return (
        <BottomSheetModal
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: colors.card }}
            handleIndicatorStyle={{ backgroundColor: colors.text }}
            ref={bottomSheetRef}
            onDismiss={onClose}
        >
            {renderButtons()}
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    style={{
                        position: 'absolute',
                        bottom: '50%',
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
        </BottomSheetModal>
    );
});

export default ActionButtons;
