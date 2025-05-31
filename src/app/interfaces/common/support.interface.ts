export interface Support {
  _id?: string;
  shop: string | any;
  name?: string;
  phone?: string;
  email?: string;
  images?: string[];
  url?: string;
  businessName?: string;
  priority?: 'low' | 'medium' | 'high';
  type: 'issue' | 'feedback' | 'feature';
  description: string;
  descriptionShort: string;
  status?: 'Pending' | 'Approved' | 'Working On It' | 'Resolved' | 'ReOpen';
  rating?: number;
  review?: string;
  note?: string;
  assignUser: any;
  resolveDate?: any;
  createdAt?: string;
  updatedAt?: string;
  select?: boolean;
  state?: string;
}
