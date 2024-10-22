export interface EnrollmentModalProps {
  openEnrollment: boolean;
  closeModal: () => void;
  data: LeadData;
  // onSubmit: (enrollmentData: any) => void;
}

export interface LeadData {
  id: string;
  email: string;
  contactNumber: string;
  productAmount: number;
  discount: number;
  description: string;
  fullName: string;
  channel: string;
  status: string;
  product: string;
  assignedTo: string;
  
}
