import { User } from "../../../users/models/user.model";

export interface TableGridDataConfig<T> {
    showSelectColumn?: boolean;
    tableData?: T[];
    isVisibleFeatureByRole?: boolean;
    callBackById?: ((data: T) => boolean);
    callBackByIcon?: ((data:any) => boolean);
}
