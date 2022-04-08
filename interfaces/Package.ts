import { City } from '@interfaces/City';
import { User } from '@interfaces/User';
import { Company } from '@interfaces/Company';

export interface Package {
    id: number;
    name: string;
    token: string;
    marking?: { [key: string]: number };
    address?: string;
    note?: string;
    city?: City;
    roles: string[];
    user?: User;
    deliverer?: User;
    creator?: User;
    company?: Company;
}
