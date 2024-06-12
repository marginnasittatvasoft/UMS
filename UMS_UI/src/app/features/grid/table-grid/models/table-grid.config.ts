import { TableActionButton } from "./table-grid-action-button.config";
import { TableGridColumnHeaderConfig } from "./table-grid-column-header.config";
import { TableGridDataConfig } from "./table-grid-data.config";
import { TableGridAllDeleteFeature } from "./table-grid-all-delete-feature.config";
import { TableGridPaginatorConfig } from "./table-grid-paginator.config";
import { TableGridSortingConfig } from "./table-grid-sorting.config";

export interface TableDataGrid {
    pagination?: TableGridPaginatorConfig;
    sorting?: TableGridSortingConfig;
    tableData: TableGridDataConfig;
    actionButtons?: TableActionButton[];
    allDeleteFeature?: TableGridAllDeleteFeature;
    headerColumn?: TableGridColumnHeaderConfig[];
}
