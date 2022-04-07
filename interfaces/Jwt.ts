import { User } from './User';

export interface Jwt {
    token: string;
    createdAt: Date;
    refreshToken: string;
    user: User | undefined;
}
