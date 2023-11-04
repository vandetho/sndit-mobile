import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@stores';
import Constants from 'expo-constants';

const initialState: {
    scheme: 'system' | 'dark' | 'light';
    language: 'en' | 'kh';
    faceId: boolean;
    variant: 'simulator' | 'development' | 'preview' | 'release';
} = {
    scheme: 'system',
    language: 'en',
    variant: Constants.expoConfig.extra.variant || 'development',
    faceId: false,
};

export const applicationSlice = createSlice({
    name: 'applicationSlice',
    initialState,
    reducers: {
        setScheme: (state, action: PayloadAction<'system' | 'dark' | 'light'>) => {
            state.scheme = action.payload;
        },
        setFaceId: (state, action: PayloadAction<boolean>) => {
            state.faceId = action.payload;
        },
        setLanguage: (state, action: PayloadAction<'en' | 'kh'>) => {
            state.language = action.payload;
        },
    },
});

export const getMode = ({ applicationSlice }: RootState) => applicationSlice.scheme;
export const getLanguage = ({ applicationSlice }: RootState) => applicationSlice.language;
export const getFaceId = ({ applicationSlice }: RootState) => applicationSlice.faceId;

export const {
    actions: { setScheme, setLanguage, setFaceId },
} = applicationSlice;
