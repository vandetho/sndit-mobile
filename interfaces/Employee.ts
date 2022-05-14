export interface Employee {
    id: number;
    token: string;
    firstName: string;
    lastName: string;
    fullName: string;
    locale: string;
    roles: string[];
    marking: { [key: string]: number };
}
