import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

type PackageQrCodeScreenNavigationProps = StackNavigationProp<ApplicationStackParamsList, 'PackageQrCode'>;

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
});

interface HeaderButtonProps {}

const HeaderButtonComponent: React.FunctionComponent<HeaderButtonProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
    const snapPoints = React.useMemo(() => ['25%', '50%'], []);
    const navigation = useNavigation<PackageQrCodeScreenNavigationProps>();

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onPressLocation = React.useCallback(() => {
        if (bottomSheetModalRef.current) {
            bottomSheetModalRef.current.present();
        }
    }, []);

    const onPressQrCode = React.useCallback(() => {
        navigation.navigate('PackageQrCode');
    }, [navigation]);

    return (
        <React.Fragment>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                    onPress={handleGoBack}
                >
                    <GradientIcon name="chevron-left" />
                    <Text style={{ marginHorizontal: 10 }}>{t('back')}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                        onPress={onPressLocation}
                    >
                        <GradientIcon name="map-marker-alt" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                        onPress={onPressQrCode}
                    >
                        <GradientIcon name="qrcode" />
                    </TouchableOpacity>
                </View>
            </View>
            <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints}>
                <View style={styles.contentContainer}>
                    <Text>Awesome 🎉</Text>
                </View>
            </BottomSheetModal>
        </React.Fragment>
    );
};

const HeaderButton = React.memo(HeaderButtonComponent);

export default HeaderButton;
