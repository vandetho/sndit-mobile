import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GradientIcon, Text } from '@components';
import { CompositeNavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList, CompanyStackParamList } from '@navigations';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

type CompanyScreenNavigationProps = CompositeNavigationProp<
    StackNavigationProp<ApplicationStackParamsList, 'CompanyQrCode'>,
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
});

interface HeaderButtonProps {}

const HeaderButtonComponent: React.FunctionComponent<HeaderButtonProps> = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<CompanyScreenNavigationProps>();

    const handleGoBack = React.useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onPressQrCode = React.useCallback(() => {
        navigation.navigate('CompanyQrCode');
    }, [navigation]);

    const onPressEmployees = React.useCallback(() => {
        navigation.navigate('Employees');
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
                        style={[styles.buttonContainer, { backgroundColor: colors.card, marginRight: 10 }]}
                        onPress={onPressEmployees}
                    >
                        <GradientIcon name="users" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: colors.card }]}
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
