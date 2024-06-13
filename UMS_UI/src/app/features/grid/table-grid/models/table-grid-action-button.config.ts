export interface TableActionButton<T> {
    icon: string;
    color?: string;
    callBack(data: T): void;
}