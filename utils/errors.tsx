import React from 'react';

export const hasError = (field: string, formState: { [key: string]: any }): boolean => {
    return formState.touched[field] && formState.errors !== undefined && formState.errors[field] !== undefined;
};

export const displayErrors = (field: string, formState: { [key: string]: any }): string | null | undefined => {
    if (hasError(field, formState)) {
        return formState.errors[field];
    }
    return null;
};
