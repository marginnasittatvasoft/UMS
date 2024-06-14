export interface TableGridActionButton<T> {
    icon: string;
    color?: string;
    callBack(data: T): void;
    disabledCallBack(data: any): void;
}