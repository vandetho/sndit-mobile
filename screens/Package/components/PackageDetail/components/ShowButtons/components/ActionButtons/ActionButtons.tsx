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
    onDone: () => void;
}

export interface ActionButtonRefProps {
    present: () => void;
    dismiss: () => void;
}

const ActionButtons = React.memo(
    React.forwardRef<ActionButtonRefProps, ActionButtonsProps>(({ item, onDone }, ref) => {
        const { colors } = useTheme();
        const bottomSheetRef = React.useRef<BottomSheetModal>(null);
        const { t } = useTranslation();
        const {
            jwt: { user },
        } = useAuthentication();

        React.useImperativeHandle(ref, () => ({
            present: () => {
                if (bottomSheetRef.current) {
                    bottomSheetRef.current.present();
                }
            },
            dismiss: () => {
                if (bottomSheetRef.current) {
                    bottomSheetRef.current.dismiss();
                }
            },
        }));

        const snapPoints = React.useMemo(() => ['50%', '75%'], []);
        console.log({ item });
        const onClose = React.useCallback(() => {
            if (bottomSheetRef.current) {
                bottomSheetRef.current.dismiss();
            }
        }, []);

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
                    <TakePackageButton
                        item={item}
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
                name={`package-${item.id}-active-modal`}
                backgroundStyle={{ backgroundColor: colors.card }}
                handleIndicatorStyle={{ backgroundColor: colors.text }}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
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
    }),
);

export default ActionButtons;
