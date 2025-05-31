import {Category} from './category.interface';

export interface SubCategory {
  description: any;
  deleteDateString: any;
  _id?: string;
  readOnly?: boolean;
  category?: string | Category;
  categoryInfo?: Category;
  name?: string;
  slug?: string;
  image?: string;
  images?: any;
  priority?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
