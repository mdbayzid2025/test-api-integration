import {Package} from "./package.interface";

export interface Subscriptions {
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  reference: string;
  phoneNo: string;
    name: string;
  _id?: string;
  shop?: string;
  package?: Package;
  starDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  select: boolean;
}
