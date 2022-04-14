export { default as AuthStorage } from './AuthStorage';
export { default as axios } from './axios';
export { default as request } from './request';
export * from './errors';
export * from './isIphoneX';
export * from './toast';

export const getRoleLabel = (roles: string[]) => {
    if (roles.includes('ROLE_OWNER')) {
        return 'owner';
    }
    if (roles.includes('ROLE_MANAGER')) {
        return 'manager';
    }
    return 'employee';
};
