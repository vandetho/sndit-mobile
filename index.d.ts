declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_VARIANT: 'simulator' | 'development' | 'preview' | 'release';
        }
    }
}

export {};
