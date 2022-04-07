import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { isIphoneX } from '@utils';

export const BORDER_COLOR = '#d5d5d5';
export const BUTTON_FONT_WEIGHT = 'normal';
export const BUTTON_FONT_SIZE = 20;
export const HIGHLIGHT_COLOR = '#ebebeb';

const BORDER_RADIUS = 25;

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'flex-end',
    },
    pickerContainer: {
        borderRadius: BORDER_RADIUS,
        marginBottom: 10,
        overflow: 'hidden',
    },
    modalButton: {
        borderColor: BORDER_COLOR,
        backgroundColor: 'transparent',
        height: 45,
        justifyContent: 'center',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: BUTTON_FONT_WEIGHT,
        backgroundColor: 'transparent',
    },
    cancelButton: {
        borderRadius: BORDER_RADIUS,
        height: 45,
        marginBottom: isIphoneX() ? 20 : 0,
        justifyContent: 'center',
    },
    cancelText: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: '600',
        backgroundColor: 'transparent',
    },
});

interface PhotoPickerProps {
    isVisible: boolean;
    onCancel: () => void;
    onGallery: () => void;
    onCamera: () => void;
}

const PhotoPickerComponent: React.FunctionComponent<PhotoPickerProps> = ({
    isVisible,
    onGallery,
    onCamera,
    onCancel,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const onBackdropPress = React.useCallback((): void => {
        onCancel();
    }, [onCancel]);

    return (
        <Modal
            isVisible={isVisible}
            style={styles.modalContainer}
            onBackdropPress={onBackdropPress}
            backdropTransitionOutTiming={0}
            hideModalContentWhileAnimating
        >
            <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
                <TouchableHighlight
                    style={[styles.modalButton, { backgroundColor: colors.card }]}
                    underlayColor={HIGHLIGHT_COLOR}
                    onPress={onGallery}
                >
                    <Text style={[styles.buttonText, { color: colors.text }]}>{t('photo_gallery')}</Text>
                </TouchableHighlight>
                <View style={{ height: 2, width: '100%', backgroundColor: colors.border }} />
                <TouchableHighlight
                    style={[styles.modalButton, { backgroundColor: colors.card }]}
                    underlayColor={HIGHLIGHT_COLOR}
                    onPress={onCamera}
                >
                    <Text style={[styles.buttonText, { color: colors.text }]}>{t('camera')}</Text>
                </TouchableHighlight>
            </View>
            <TouchableHighlight
                style={[styles.cancelButton, { backgroundColor: colors.card }]}
                underlayColor={HIGHLIGHT_COLOR}
                onPress={onCancel}
            >
                <Text style={[styles.cancelText, { color: colors.text }]}>{t('cancel')}</Text>
            </TouchableHighlight>
        </Modal>
    );
};

const PhotoPicker = React.memo(PhotoPickerComponent);

export default PhotoPicker;
