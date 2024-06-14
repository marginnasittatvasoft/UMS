import { TableGridAddButtton } from "./table-grid-add-button.config";
import { TableGridMultipleDelete } from "./table-grid-multiple-delete.config";
import { TableGridPaginatorConfig } from "./table-grid-paginator.config";
import { TableGridSortingConfig } from "./table-grid-sorting.config";

export interface TableGridFeaturesConfig<T> {
    isShowSelectColumn?: boolean;
    isShowFilterOption?: boolean;
    callBack?: ((data: T) => boolean);
    pagination?: TableGridPaginatorConfig;
    sorting?: TableGridSortingConfig;
    multipleDelete?: TableGridMultipleDelete<T>;
    addButton?: TableGridAddButtton<T>[];
}


