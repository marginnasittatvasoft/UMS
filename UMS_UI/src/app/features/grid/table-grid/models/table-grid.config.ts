import { TableGridPaginatorConfig } from "./table-grid-paginator.config";
import { TableGridSortingConfig } from "./table-grid-sorting.config";

export interface TableDataGrid {
    pagination?: TableGridPaginatorConfig;
    sorting?: TableGridSortingConfig;
}