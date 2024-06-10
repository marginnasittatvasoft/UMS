import { SortDirection } from "@angular/material/sort";

export interface TableGridSortingConfig {
    defaultSortingOrder?: SortDirection;
    SortDisableClear?: boolean;
    matSortActiveColumn?: string;
    disabledSorting?: boolean;
}