import { TableGridColumnConfig } from "./table-grid-column.config";
import { TableGridDataConfig } from "./table-grid-data.config";
import { TableGridPaginatorConfig } from "./table-grid-paginator.config";
import { TableGridSortingConfig } from "./table-grid-sorting.config";
import { TableActionButton, TableGridAddButtton, TableGridFeaturesConfig, TableGridMultipleDelete } from "./table-grid-features.config";

export interface TableDataGrid<T> {
    pagination?: TableGridPaginatorConfig;
    sorting?: TableGridSortingConfig;
    tableGridData: TableGridDataConfig<T>;
    actionButtons?: TableActionButton<T>[];
    multipleDelete?: TableGridMultipleDelete<T>;
    column?: TableGridColumnConfig[];
    addButton?: TableGridAddButtton<T>[];
    features?: TableGridFeaturesConfig<T>;
}
