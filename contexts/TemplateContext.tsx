import React from 'react';
import { Template } from '@interfaces';
import { useTemplatesFetcher } from '@fetchers';
import { useCompany } from './CompanyContext';

export const TemplateContext = React.createContext<{
    templates: Template[];
    isLoading: boolean;
    isLoadingMore: boolean;
    item: Template;
    onSelect: (template: Template) => void;
    onFetch: () => void;
    onFetchMore: () => void;
}>({
    item: undefined,
    isLoading: false,
    isLoadingMore: false,
    templates: [],
    onSelect: (template: Template) => {
        console.log({ name: 'onSelect', template });
    },
    onFetch: () => {
        console.log({ name: 'fetchTemplates' });
    },
    onFetchMore: () => {
        console.log({ name: 'fetchMoreTemplates' });
    },
});

interface TemplateProviderProps {
    children?: React.ReactNode;
}

export const TemplateProvider: React.FunctionComponent<TemplateProviderProps> = ({ children }) => {
    const { company } = useCompany();
    const [state, setState] = React.useState<{
        item: Template;
    }>({
        item: undefined,
    });
    const { templates, fetch, isLoading, fetchMore, isLoadingMore } = useTemplatesFetcher();

    React.useEffect(() => {
        if (company) {
            (async () => await fetch(company))();
        }
    }, [company, fetch]);

    const onFetch = React.useCallback(() => {
        fetch(company);
    }, [company, fetch]);

    const onFetchMore = React.useCallback(() => {
        fetchMore(company);
    }, [company, fetchMore]);

    const onSelect = React.useCallback((pkg: Template) => {
        setState((prevState) => ({ ...prevState, item: pkg }));
    }, []);

    return (
        <TemplateContext.Provider
            value={{
                ...state,
                templates,
                isLoading,
                isLoadingMore,
                onSelect,
                onFetch,
                onFetchMore,
            }}
        >
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplate = () => {
    return React.useContext(TemplateContext);
};
