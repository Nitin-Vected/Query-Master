export interface LeadData {
  name: string;
  contact: number;
  email: string;
  channel: string; // e.g., 'Instagram'
  counsellor: string; // e.g., 'Interested'
}

export interface LeadPreviewModalProps {
  open?: boolean;
  handleClose: (() => void) | undefined | any;
  data?: any; // Array of lead data entries
  isEdit?: boolean; // Array of lead data entries
}

export interface AuditLogValue {
  createdAt: string; // or Date if it's a Date object
  editedBy: string;
  field: string;
  oldValue: string;
  newValue: string;
}

export interface FormValues {
   productId: number | string;
  assignedTo: number | string;
  email: string;
  statusId: number;
  comment: number | string;
  contactNumber: string;
  productAmount: number | string;
  channelId: string;
  description: string;
  fullName: string;
}
