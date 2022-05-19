import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Backdrop, BarLoader, GradientIcon, ScannerMask, Text } from '@components';
import { CompositeNavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList, CompanyStackParamList } from '@navigations';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BarCodeEvent, BarCodeScanner } from 'expo-barcode-scanner';
import { showToast } from '@utils';
import { useUserFetcher } from '@fetchers';
import { useUser } from '@contexts';
import { Template } from '@interfaces';
import { useVisible } from '@hooks';
import { TemplateForm } from '@screens/Templates/components/HeaderSection/components/HeaderButton/components';

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
    const { visible, onToggle } = useVisible();
    const [template, setTemplate] = React.useState<Template>(undefined);
    const navigation = useNavigation<CompanyScreenNavigationProps>();

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleNewTemplate = React.useCallback(() => {
        setTemplate(undefined);
        onToggle();
    }, [onToggle]);
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
                    onPress={handleNewTemplate}
                >
                    <GradientIcon name="plus" size={20} />
                </TouchableOpacity>
            </View>
            <TemplateForm visible={visible} template={template} />
        </React.Fragment>
    );
};

const HeaderButton = React.memo(HeaderButtonComponent);

export default HeaderButton;
