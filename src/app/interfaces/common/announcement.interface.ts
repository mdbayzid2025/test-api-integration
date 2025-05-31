export interface Announcement {
  _id?: string;
  title?: string;
  type?: string;
  image?: string;
  url?: string;
  urlType?: string;
  description?: string;
  priority?: number;
  status?: string;
  select: boolean;
  createdAt?: string;
  updatedAt?: string;
}
