import { BlobOptions } from "buffer";
import { User } from "../../../users/models/user.model";

export interface TableGridDataConfig<T> {
    isShowSelectColumn?: boolean;
    isShowFilterOption?: boolean;
    tableData?: T[];
    callBackById?: ((data: T) => boolean);
    callBackByIcon?: ((data: any) => boolean);
}
