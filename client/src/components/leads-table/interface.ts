export interface TableMain {
  id: number | string; // Unique identifier
  CurrentStatus: string; // Current status as a string
  name: string; // Name of the person
  time: string; // Time represented as a string
  phone: string; // Phone number as a string
  email: string; // Email address as a string
  course: string; // Course name as a string
  Channel: string; // Channel name as a string
  ManageStatus: Array<"Interested" | "Not Interested" | "Enrolled">; // ManageStatus as an array of specific strings
  Status: string;
  discountAmount: string;
  finalAmount: string;
  type?: string; // Optional property to include the 'type'
}

export type TableData = TableMain[];

export interface LeadTableProps {
  editFunction: (row: TableMain) => void;
}
