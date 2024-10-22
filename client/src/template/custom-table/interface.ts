export type TableColumn<T> = {
  label: string;
  key?: keyof T;
  render?: (value: T[keyof T], row: T, index: number) => React.ReactNode;
};

export interface CustomTableProps<T> {
  headers: TableColumn<T>[];
  rows: T[];
}
