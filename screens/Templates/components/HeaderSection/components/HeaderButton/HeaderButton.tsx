import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { useNavigation, useTheme } from '@react-navigation/native';
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
    maskViewContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    barcodeScanner: {
        ...StyleSheet.absoluteFillObject,
    },
});

interface HeaderButtonProps {
    onPressNew: () => void;
}

const HeaderButtonComponent: React.FunctionComponent<HeaderButtonProps> = ({ onPressNew }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation();

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
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
                <TouchableOpacity
                    style={[styles.buttonContainer, { backgroundColor: colors.card }]}
                    onPress={onPressNew}
                >
                    <GradientIcon name="file-medical" size={20} />
                </TouchableOpacity>
            </View>
        </React.Fragment>
    );
};

const HeaderButton = React.memo(HeaderButtonComponent);

export default HeaderButton;
