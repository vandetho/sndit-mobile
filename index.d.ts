declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_VARIANT: 'simulator' | 'development' | 'preview' | 'release';
            EXPO_PUBLIC_API_URL: string;
            EXPO_PROJECT_ID: string;
        }
    }
}

export {};
