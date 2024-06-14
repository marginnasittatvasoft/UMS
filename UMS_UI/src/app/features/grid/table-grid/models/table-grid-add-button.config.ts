export interface TableGridAddButtton<T> {
    btnText: string;
    color?: string;
    isVisible?: boolean;
    callBack(data: T): void;
}