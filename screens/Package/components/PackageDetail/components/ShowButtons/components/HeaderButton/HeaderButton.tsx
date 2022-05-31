import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations';
import { Package } from '@interfaces';
import { MapButton, NoteButton } from './components';
import { useVisible } from '@hooks';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

type PackageQrCodeScreenNavigationProps = StackNavigationProp<ApplicationStackParamsList, 'PackageQrCode' | 'Map'>;

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

interface HeaderButtonProps {
    item: Package;
}

const HeaderButtonComponent: React.FunctionComponent<HeaderButtonProps> = ({ item }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<PackageQrCodeScreenNavigationProps>();
    const { visible, onToggle, onClose } = useVisible();

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

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
                    <GradientIcon name="times" />
                    <Text style={{ marginHorizontal: 10 }}>{t('close')}</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <MapButton item={item} />
                    <NoteButton item={item} />
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: colors.card, marginLeft: 10 }]}
                        onPress={onPressQrCode}
                    >
                        <GradientIcon name="qrcode" />
                    </TouchableOpacity>
                </View>
            </View>
        </React.Fragment>
    );
};

const HeaderButton = React.memo(HeaderButtonComponent);

export default HeaderButton;
