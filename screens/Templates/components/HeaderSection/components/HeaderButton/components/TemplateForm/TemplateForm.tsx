import React from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { City, Template } from '@interfaces';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Button, CityPicker, Header, Text, TextField } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@react-navigation/native';
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
interface TemplateFormProps {
    template: Template;
    visible: boolean;
}

const TemplateForm = React.memo<TemplateFormProps>(({ visible, template }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const [state, setState] = React.useState<{
        name: string;
        phoneNumber: string;
        address: string;
        city: City | undefined;
        dispatch: boolean;
    }>({ address: '', city: undefined, dispatch: false, name: '', phoneNumber: '' });

    const snapPoints = React.useMemo(() => ['65%', '90%'], []);

    return (
        <BottomSheetModal snapPoints={snapPoints} ref={bottomSheetRef}>
            <ScrollView style={styles.container}>
                <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
                    <TextField label={t('name')} name="name" value={state.name} onChangeText={onChangeText} />
                    <TextField label={t('address')} name="address" value={state.address} onChangeText={onChangeText} />
                    <CityPicker selected={state.city} onValueChange={onChangeCity} />
                </View>
                <Button
                    isLoading={state.dispatch}
                    label={t('save')}
                    endIcon={<FontAwesome5 name="save" color="#FFFFFF" size={20} />}
                    onPress={onPressSave}
                    style={styles.saveButton}
                />
            </ScrollView>
        </BottomSheetModal>
    );
});

export default TemplateForm;
