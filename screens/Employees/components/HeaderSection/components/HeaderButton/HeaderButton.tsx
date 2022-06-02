import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, ScannerModal, Text } from '@components';
import { CompositeNavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList, CompanyStackParamList } from '@navigations';
import { useVisible } from '@hooks';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

type CompanyScreenNavigationProps = CompositeNavigationProp<
    StackNavigationProp<ApplicationStackParamsList, 'CompanyQrCode' | 'User'>,
    StackNavigationProp<CompanyStackParamList, 'Employees'>
>;

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

interface HeaderButtonProps {}

const HeaderButtonComponent: React.FunctionComponent<HeaderButtonProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<CompanyScreenNavigationProps>();
    const { visible, onToggle } = useVisible();

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
                <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: colors.card }]} onPress={onToggle}>
                    <GradientIcon name="user-plus" size={20} />
                </TouchableOpacity>
            </View>
            <ScannerModal visible={visible} onClose={onToggle} />
        </React.Fragment>
    );
};

const HeaderButton = React.memo(HeaderButtonComponent);

export default HeaderButton;
