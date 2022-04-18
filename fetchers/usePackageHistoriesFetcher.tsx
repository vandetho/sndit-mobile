import React from 'react';
import { Package, PackageHistory, ResponseSuccess } from '@interfaces';
import { axios } from '@utils';

export const usePackageHistoriesFetcher = (item: Package) => {
    const [state, setState] = React.useState<{
        histories: PackageHistory[];
        totalRows: number;
        isLoading: boolean;
        errorMessage: string | undefined;
    }>({
        histories: [],
        totalRows: 0,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetch = React.useCallback(async () => {
        if (item) {
            setState((prevState) => ({ ...prevState, isLoading: true }));
            try {
                const {
                    data: { data },
                } = await axios.get<ResponseSuccess<{ histories: PackageHistory[]; totalRows: number }>>(
                    `/api/packages/${item.id}/histories`,
                );
                setState((prevState) => ({ ...prevState, ...data, isLoading: false }));
            } catch ({ response: { data } }) {
                setState((prevState) => ({ ...prevState, isLoading: false, errorMessage: data.message }));
            }
        }
    }, [item]);

    return { ...state, fetch };
};
