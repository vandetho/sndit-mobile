import React from 'react';
import { Package } from '@interfaces';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';

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
    modalTopContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PADDING,
        borderRadius: 50,
        marginVertical: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        margin: 10,
        height: 50,
        borderRadius: 15,
    },
});

interface NoteButtonProps {
    item: Package;
}

const NoteButton = React.memo<NoteButtonProps>(({ item }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const { visible, onToggle, onClose } = useVisible();

    const snapPoint = React.useMemo(() => ['25%', '50%'], []);

    if (item.note) {
        return (
            <React.Fragment>
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card, marginLeft: 10 }]}
                    onPress={onToggle}
                >
                    <GradientIcon name="sticky-note" />
                </TouchableOpacity>
                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: colors.card }}
                    handleIndicatorStyle={{ backgroundColor: colors.text }}
                    snapPoints={snapPoint}
                    ref={bottomSheetRef}
                    onDismiss={onClose}
                >
                    <View style={styles.modalTopContainer}>
                        <Text>{t('note')}</Text>
                        <TouchableOpacity
                            style={[styles.buttonContainer, { backgroundColor: colors.background }]}
                            onPress={onClose}
                        >
                            <GradientIcon name="times" />
                        </TouchableOpacity>
                    </View>
                </BottomSheetModal>
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
                        <TouchableOpacity
                            onPress={onToggle}
                            style={[styles.modalButtonContainer, { backgroundColor: colors.background }]}
                        >
                            <GradientIcon name="times" />
                            <Text bold style={{ marginHorizontal: 10 }}>
                                {t('close')}
                            </Text>
                        </TouchableOpacity>
                        <View style={{ padding: 10 }}>
                            <Text bold style={{ marginVertical: 10 }}>
                                {t('note')}
                            </Text>
                            <Text>{item.note}</Text>
                        </View>
                    </View>
                </Modal>
            </React.Fragment>
        );
    }

    return null;
});

export default NoteButton;
