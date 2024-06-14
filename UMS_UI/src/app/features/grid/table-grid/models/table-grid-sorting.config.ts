import { SortDirection } from "@angular/material/sort";

export interface TableGridSortingConfig {
    defaultSortingOrder?: SortDirection;
    sortDisableClear?: boolean;
    defaultSortActiveColumn?: string;
    disabledSorting?: boolean;
    isVisibleSortDirection?: boolean;
    isVisibleSorting?: boolean;
}