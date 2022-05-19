import React from 'react';
import { Package } from '@interfaces';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';

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
        flex: 1,
        alignItems: 'center',
    },
});

interface NoteButtonProps {
    item: Package;
}

const NoteButton = React.memo<NoteButtonProps>(({ item }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const { visible, onToggle } = useVisible();

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.close();
        }
    }, [visible]);

    const snapPoint = React.useMemo(() => ['25%', '50%'], []);

    if (item.note) {
        return (
            <React.Fragment>
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card, marginLeft: 10 }]}
                    onPress={onToggle}
                >
                    <GradientIcon name="map-marker-alt" />
                </TouchableOpacity>
                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: colors.card }}
                    handleIndicatorStyle={{ backgroundColor: colors.text }}
                    snapPoints={snapPoint}
                    ref={bottomSheetRef}
                >
                    <View style={styles.modalTopContainer}>
                        <Text>{t('note')}</Text>
                        <TouchableOpacity
                            style={[styles.buttonContainer, { backgroundColor: colors.background }]}
                            onPress={onToggle}
                        >
                            <GradientIcon name="close" />
                        </TouchableOpacity>
                    </View>
                    <Text>{item.note}</Text>
                </BottomSheetModal>
            </React.Fragment>
        );
    }

    return null;
});

export default NoteButton;
