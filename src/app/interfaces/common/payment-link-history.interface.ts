export interface PaymentLinkHistory {
  paymentMethod: string;
  paymentStatus: string;
  amount: number;
  phoneNo: string;
  price: number;
  status: string;
  _id?: string;
  readOnly?: boolean;
  name?: string;
  slug?: string;
  images?: [string];
  image?: any;
  priority?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
