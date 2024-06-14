export interface TableGridFeaturesConfig<T> {
    isShowSelectColumn?: boolean;
    isShowFilterOption?: boolean;
    callBackById?: ((data: T) => boolean);
}

export interface TableGridMultipleDelete<T> {
    callBack(data: T[]): void;
}

export interface TableGridAddButtton<T> {
    btnText: string;
    color?: string;
    isVisible?: boolean;
    callBack(data: T): void;
}

export interface TableActionButton<T> {
    icon: string;
    color?: string;
    callBack(data: T): void;
    visibilityCallBack(data: any): void;
}