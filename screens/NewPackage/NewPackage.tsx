import React from 'react';
import { View } from 'react-native';
import { useCompany } from '@contexts';
import PagerView from 'react-native-pager-view';
import { CompanyList, PackageForm } from './components';
import { Company } from '@interfaces';

interface NewPackageProps {}

const NewPackage = React.memo<NewPackageProps>(() => {
    const { company } = useCompany();
    const [state, setState] = React.useState({
        company,
        page: company ? 0 : 1,
    });

    const onPress = React.useCallback((company: Company) => {
        setState((prevState) => ({ ...prevState, company, page: 1 }));
    }, []);

    const onBack = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, page: 0 }));
    }, []);

    return (
        <PagerView initialPage={state.page} scrollEnabled={false}>
            <View key="1">
                <CompanyList onPress={onPress} />
            </View>
            <View key="2">
                <PackageForm company={state.company} onBack={onBack} />
            </View>
        </PagerView>
    );
});

export default NewPackage;
