export interface AffiliatePaymentReport{
  note: any;
  amount: any;
  paymentMethod: any;
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
