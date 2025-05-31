import {ThemeCategory} from './theme-category.interface';
import {ThemeSubCategory} from './theme-sub-category.interface';

export interface ALLTableData {
  _id?: string;
  name?: string;
  category?: ThemeCategory;
  subCategory?: ThemeSubCategory;
  sourcePath?: string;
  targetPath?: string;
  images?: string[];
  pdf?: string;
  previewLink?: string;
  availability?: string;
  totalInstalled?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
