import { City } from '@interfaces/City';
import { User } from '@interfaces/User';
import { Company } from '@interfaces/Company';

export interface Template {
    id: number;
    name: string;
    phoneNumber: string;
    address?: string;
    city?: City;
    creator?: User;
    company?: Company;
}
