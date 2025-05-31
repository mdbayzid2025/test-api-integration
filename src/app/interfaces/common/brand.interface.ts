 export interface Brand {
  _id?: string;
  readOnly?: boolean;
  name?: string;
  slug?: string;
  image?: string;
  images?: any;
  priority?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
