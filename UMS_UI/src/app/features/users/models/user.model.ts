export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city?: string;
    state?: string;
    userName: string;
    password: string;
    roleId: number;
}