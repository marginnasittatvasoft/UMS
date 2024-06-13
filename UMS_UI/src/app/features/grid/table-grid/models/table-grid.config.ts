import { TableActionButton } from "./table-grid-action-button.config";
import { TableGridColumnHeaderConfig } from "./table-grid-column-header.config";
import { TableGridDataConfig } from "./table-grid-data.config";
import { TableGridAllDeleteFeature } from "./table-grid-all-delete-feature.config";
import { TableGridPaginatorConfig } from "./table-grid-paginator.config";
import { TableGridSortingConfig } from "./table-grid-sorting.config";
import { TableGridAddFeature } from "./table-grid-add-feature.confing";

export interface TableDataGrid<T> {
    pagination?: TableGridPaginatorConfig<T>;
    sorting?: TableGridSortingConfig<T>;
    tableGridData: TableGridDataConfig<T>;
    actionButtons?: TableActionButton<T>[];
    allDeleteFeature?: TableGridAllDeleteFeature<T>;
    headerColumn?: TableGridColumnHeaderConfig<T>[];
    addFetures?: TableGridAddFeature<T>[];
}
