import { SortDirection } from "@angular/material/sort";

export interface TableGridSortingConfig<T> {
    defaultSortingOrder?: SortDirection;
    sortDisableClear?: boolean;
    defaultSortActiveColumn?: string;
    disabledSorting?: boolean;
}