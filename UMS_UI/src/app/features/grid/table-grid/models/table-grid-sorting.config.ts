import { SortDirection } from "@angular/material/sort";

export interface TableGridSortingConfig {
    defaultSortingOrder?: SortDirection;
    sortDisableClear?: boolean;
    matSortActiveColumn?: string;
    disabledSorting?: boolean;
}