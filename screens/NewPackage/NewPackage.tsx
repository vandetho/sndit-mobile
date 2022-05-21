import React from 'react';
import { View } from 'react-native';
import { useCompany } from '@contexts';
import PagerView from 'react-native-pager-view';
import { CompanyList, PackageForm } from './components';
import { Company } from '@interfaces';

interface NewPackageProps {}

const NewPackage = React.memo<NewPackageProps>(() => {
    const { company, managerCompanies } = useCompany();
    const viewerRef = React.useRef<PagerView>(null);
    const [state, setState] = React.useState<{ company: Company | undefined; page: number }>(() => {
        let item = company;
        if (item === undefined && managerCompanies.length === 1) {
            item = managerCompanies[0];
        }
        return {
            company: item,
            page: item ? 1 : 0,
        };
    });

    React.useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.setPage(state.page);
        }
    }, [state.page]);

    const onPress = React.useCallback((company: Company) => {
        setState((prevState) => ({ ...prevState, company, page: prevState.page + 1 }));
    }, []);

    const onBack = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, page: 0 }));
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <PagerView initialPage={state.page} scrollEnabled={false} ref={viewerRef} style={{ flex: 1 }}>
                <View key="1">
                    <CompanyList onPress={onPress} />
                </View>
                <View key="2">
                    <PackageForm company={state.company} onBack={onBack} />
                </View>
            </PagerView>
        </View>
    );
});

export default NewPackage;
