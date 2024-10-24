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

 export interface ProductAssets {
  image: string;      // URL or path to the product image
  document: string;   // URL or path to the document (e.g., syllabus)
}

export interface Product {
  assets: ProductAssets; // Assets associated with the product
  id: string;           // Unique identifier for the product
  name: string;         // Name of the product
  category: string;     // Category of the product
  price: number;        // Regular price of the product
  discountPrice: number; // Discounted price of the product
  description: string;  // Description of the product
}


export  interface AllStatus {
  id: string; // Unique identifier for the status
  name: string; // Name of the status
}