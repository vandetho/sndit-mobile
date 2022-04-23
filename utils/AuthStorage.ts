import * as SecureStore from 'expo-secure-store';
import { Jwt, User } from '@interfaces';
import { formatISO } from 'date-fns';

class AuthStorage {
    public static async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('jwt_token');
    }

    public static async setToken(token: string): Promise<void> {
        await SecureStore.setItemAsync('jwt_token', token);
    }

    public static async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync('jwt_refresh_token');
    }

    public static async setRefreshToken(refreshToken: string): Promise<void> {
        await SecureStore.setItemAsync('jwt_refresh_token', refreshToken);
    }

    public static async getUser(): Promise<string | null> {
        return await SecureStore.getItemAsync('user');
    }

    public static async setUser(user: User): Promise<void> {
        await SecureStore.setItemAsync('user', JSON.stringify(user));
    }

    public static async storeAuthentication(jwt: Jwt): Promise<void> {
        await SecureStore.setItemAsync('jwt_token', jwt.token);
        await SecureStore.setItemAsync('jwt_refresh_token', jwt.refreshToken);
        await SecureStore.setItemAsync('created_at', formatISO(jwt.createdAt));
        if (jwt.user) {
            await SecureStore.setItemAsync('user', JSON.stringify(jwt.user));
        }
    }

    public static async signOut(): Promise<void> {
        await SecureStore.deleteItemAsync('jwt_token');
        await SecureStore.deleteItemAsync('jwt_refresh_token');
        await SecureStore.deleteItemAsync('created_at');
        await SecureStore.deleteItemAsync('user');
    }
}

export default AuthStorage;
