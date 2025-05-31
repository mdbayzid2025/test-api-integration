export interface Shop {
  _id?: string;
  name?: string;
  port?: number;
  slug?: string;
  websiteName?: string;
  buildStatus?: string;
  images?: any;
  clientNotes?: any;
  domain?: string;
  subDomain?: string;
  category?: string;
  subCategory?: string;
  theme?: any;
  dateString?: string;
  startDate?: string;
  owner?: any;
  users?: any;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
  email?: any;
  phoneNo?: any;
  shopType?: string;
  remainingSubDay?: number;
}
