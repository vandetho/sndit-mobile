export type FormType<P> = {
    isValid: boolean;
    values: P;
    touched: {
        [key in keyof P]: boolean;
    };
    errors?: {
        [key: string]: string;
    };
    show?: {
        [key: string]: boolean;
    };
    dispatch?: boolean;
};
