import { User } from "../../../users/models/user.model";

export interface TableGridDataConfig {
    showSelectColumn?: boolean;
    userData?: User[];
    userRole?: string;
    userId?: number;
}