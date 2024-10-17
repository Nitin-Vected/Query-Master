export interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (leadData: any) => void;
}