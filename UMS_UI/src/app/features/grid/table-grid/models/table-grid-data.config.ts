import { User } from "../../../users/models/user.model";

export interface TableGridDataConfig {
    showSelectColumn?: boolean;
    tableData?: User[];
    userRole?: string;
    userId?: number;
    callBackById?: ((data: any) => boolean);
    callBackByIcon?: ((data: any) => boolean);
    callBackByRole?: ((data: any) => void);
}
