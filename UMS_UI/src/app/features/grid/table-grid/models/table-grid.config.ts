import { TableGridActionButton } from "./table-grid-action-button.config";
import { TableGridColumnConfig } from "./table-grid-column.config";
import { TableGridFeaturesConfig } from "./table-grid-features.config";

export interface TableDataGrid<T> {
    tableData?: T[];
    actionButtons?: TableGridActionButton<T>[];
    column?: TableGridColumnConfig[];
    features?: TableGridFeaturesConfig<T>;
}
