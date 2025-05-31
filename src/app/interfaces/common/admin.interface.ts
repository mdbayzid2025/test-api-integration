import {AdminRoles} from '../../enum/admin-roles.enum';
import {AdminPermissions} from '../../enum/admin-permission.enum';

export interface Admin {
  minWithdrawAmount: any;
  paymentInstructions: any;
  _id?: string;
  readOnly?: boolean;
  name?: string;
  username?: string;
  password?: string;
  phoneNo?: string;
  email?: string;
  gender?: string;
  userLevel?: string;
  userId?: string;
  profileImg?: string;
  hasAccess?: boolean;
  role?: AdminRoles;
  permissions?: AdminPermissions[];
  registrationAt?: string;
  lastLoggedIn?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredInDays?: string;
  data?: any;
  message?: string;
}

export interface AdminJwtPayload {
  _id?: string;
  username: string;
  role: AdminRoles;
  permissions: AdminPermissions[];
}
