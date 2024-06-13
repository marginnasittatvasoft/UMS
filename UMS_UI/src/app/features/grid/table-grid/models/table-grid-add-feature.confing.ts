export interface TableGridAddFeature<T> {
    btnText: string;
    color?: string;
    isVisible?: boolean;
    callBack(data: T): void;
}