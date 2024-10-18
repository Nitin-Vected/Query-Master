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
