// Define the structure of each lead data entry
export interface LeadData {
  id: number; // or string, depending on your data type
  name: string;
  time: string; // or Date, if you prefer to handle dates as Date objects
  phone: string;
  email: string;
  channel: string; // e.g., 'Instagram'
  currentStatus: string; // e.g., 'Interested'
  manageStatus: string[]; // Array of possible statuses
  course: string; // e.g., 'Data Analyst'
  type: string;
}

// Update the props interface to use the defined LeadData type
export interface LeadPreviewModalProps {
  open?: boolean;
  handleOpen?: () => void;
  // handleClose?: () => void;
  handleClose: (() => void) | undefined | any;

  data?: any; // Array of lead data entries
}
