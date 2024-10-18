export type TableColumn<T> = {
  label: string;
  key?: keyof Lead; // Constraining to keys of Lead
  render?: (
    value: Lead[keyof Lead],
    row: Lead,
    index: number
  ) => React.ReactNode; // Use Lead directly
};

export interface CustomTableProps {
  headers: TableColumn<Lead>[]; // Use Lead directly
  rows: {
    leads: Lead[]; // Use Lead directly
  };
}

export interface Lead {
  id: string;
  fullName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  productAmount: number;
  discount: number;
  channelId: string; // Added based on your JSON
  statusId: string;
  productId: string;
  description: string;
  assignedTo: string | null;
}
