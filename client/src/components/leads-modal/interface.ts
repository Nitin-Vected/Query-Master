export interface LeadFormValues {
    fullName: string;
    contactNumber: string;
    leadEmail: string;
    course: string;
    status: string;
    channel: string;
    description: string;
  }
  

export interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (leadData: any) => void;
}