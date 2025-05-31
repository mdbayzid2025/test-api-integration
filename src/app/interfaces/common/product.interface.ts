import {Tag} from './tag.interface';
import {Variation, VariationOption} from './variation.interface';
import {Category} from './category.interface';
import {SubCategory} from './sub-category.interface';
import {ChildCategory} from './child-category.interface';

export interface Product {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  costPrice?: number;
  salePrice: number;
  hasTax?: boolean;
  tax?: number;
  sku: string;
  productKeyword: string[];
  emiMonth?: number[];
  discountType?: number;
  discountAmount?: number;
  images?: string[];
  trackQuantity?: boolean;
  quantity?: number;
  category?: Category;
  subCategory?: SubCategory;
  childCategory?: ChildCategory;
  brand?: CatalogInfo;
  tags?: string[] | Tag[];
  specifications?: ProductSpecification[];
  hasVariations?: boolean;
  variations?: Variation[];
  variationsOptions?: VariationOption[];
  status?: string;
  videoUrl?: string;
  unit?: string;
  // Seo
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Point
  earnPoint?: boolean;
  pointType?: number;
  pointValue?: number;
  redeemPoint?: boolean;
  redeemType?: number;
  redeemValue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  isVariation?: boolean;
  selectedQty?: number;
  // For Create Order
  orderVariationOption?: VariationOption;
  orderVariation?: string;
  variationOptions?: any;
  variation2Options?: any;
  variationList?: VariationList[];

  // For Offer
  offerDiscountAmount?: number;
  offerDiscountType?: number;
  resetDiscount?: boolean;

  vendor?: any;
}

interface CatalogInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductSpecification {
  name?: string;
  value?: string;
}

export interface VariationList {
  _id?: string;
  name?: string;
  sku?: string;
  image?: string;
  salePrice?: number;
  discountType?: number;
  discountAmount?: number;
  quantity?: number;
  trackQuantity?: number;
}
