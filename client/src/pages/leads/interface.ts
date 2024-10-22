export interface LeadData {
  id: string;
  firstName: string;
  contactNumber: string;
  email: string;
  channel: string;
  status: number;
  product: number;
  assignedTo: string;
  fullName: string;
  index: number
  action: string;
}
export interface LeadDataSubmit {
  fullName: string;
  contactNumber: string;
  leadEmail: string;
  channelId: string;
  productId: string;
  statusId: string;
  description: string;
  discount: number;
  productAmount: number;
}

export interface Counsellor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  profileImg: string;
  index: number,
  status: string
  Counsellor: string

}
export interface ManageStatus {
  id: string;
  name: string;
  status: string
  index: string
  Counsellor: string

}

export interface AllLead {
  id: string;
  fullName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  productAmount: number;
  discount: number;
  channel: string; // Added based on your JSON
  status: string;
  productId: string;
  description: string;
  assignedTo: string | null;
  action: string
}