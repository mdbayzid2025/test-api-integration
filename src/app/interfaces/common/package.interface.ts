export interface Package {
  _id?: string;
  name?: string;
  type?: string;
  image?: string;
  featureLimits?: any;
  routeLimits?: any;
  dataLimits?: any;
  features?: any;
  priceTypes?: any;
  renewInDay?: number;
  price?: number;
  discountAmount?: number;
  discountType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
