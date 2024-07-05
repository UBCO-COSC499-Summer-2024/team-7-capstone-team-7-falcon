export interface DataItem<T> {
  name: string;
  id: number;
  data: T;
}

export interface Column {
  label: string;
  renderCell: (item: any) => React.ReactNode;
}
