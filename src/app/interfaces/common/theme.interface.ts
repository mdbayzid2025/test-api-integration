import {ThemeCategory} from './theme-category.interface';
import {ThemeSubCategory} from './theme-sub-category.interface';

export interface Theme {
  _id?: string;
  name?: string;
  category?: ThemeCategory;
  subCategory?: ThemeSubCategory;
  sourcePath?: string;
  targetPath?: string;
  images?: string[];
  pdf?: string;
  reference?: string;
  previewLink?: string;
  availability?: string;
  totalInstalled?: number;
  status?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
  gitHubLink?: string;
  forceUpdate: boolean;
  select: boolean;
  themeCustomOptions: any[]
  pageCustomOptions: any[]
}
