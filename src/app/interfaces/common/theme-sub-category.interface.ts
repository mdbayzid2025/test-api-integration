import {ThemeCategory} from "./theme-category.interface";

export interface ThemeSubCategory {
  _id?: string;
  themeCategory?: ThemeCategory;
  name?: string;
  slug?: string;
  image?: string;
  priority?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
