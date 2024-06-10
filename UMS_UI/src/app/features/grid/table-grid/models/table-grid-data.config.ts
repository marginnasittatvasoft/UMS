import { User } from "../../../users/models/user.model";

export interface TableGridDataConfig {
    displayedColumn?: string[];
    filterDataColumn?: string[],
    showActionColumn?: boolean;
    showFilterOption?: boolean;
    showSortOrderOption?: boolean;
    showSortingByColumnOption?: boolean;
    showPageSizeOption?: boolean;
    userData?: User[];
}