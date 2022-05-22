import * as SecureStore from 'expo-secure-store';
import { Jwt, User } from '@interfaces';
import { formatISO } from 'date-fns';

class AuthStorage {
    public static token = 'jwt_token';
    public static refreshToken = 'jwt_refresh_token';
    public static user = 'user';
    public static createdAt = 'created_at';

    public static async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.token);
    }

    public static async setToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(this.token, token);
    }

    public static async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.refreshToken);
    }

    public static async setRefreshToken(refreshToken: string): Promise<void> {
        await SecureStore.setItemAsync(this.refreshToken, refreshToken);
    }

    public static async getUser(): Promise<User | null> {
        const user = await SecureStore.getItemAsync(this.user);
        if (user) {
            return JSON.parse(user);
        }
        return null;
    }

    public static async setUser(user: User): Promise<void> {
        await SecureStore.setItemAsync(this.user, JSON.stringify(user));
    }

    public static async storeAuthentication(jwt: Jwt): Promise<void> {
        await SecureStore.setItemAsync(this.token, jwt.token);
        await SecureStore.setItemAsync(this.refreshToken, jwt.refreshToken);
        await SecureStore.setItemAsync(this.createdAt, formatISO(jwt.createdAt));
        if (jwt.user) {
            await SecureStore.setItemAsync(this.user, JSON.stringify(jwt.user));
        }
    }

    public static async signOut(): Promise<void> {
        await SecureStore.deleteItemAsync(this.token);
        await SecureStore.deleteItemAsync(this.refreshToken);
        await SecureStore.deleteItemAsync(this.createdAt);
        await SecureStore.deleteItemAsync(this.user);
    }
}

export default AuthStorage;
