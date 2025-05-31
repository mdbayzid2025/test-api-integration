export interface User {
  _id?: string;
  shop?: string;
  name?: string;
  username?: string;
  phone?: string;
  email?: string;
  image?: string;
  password?: string;
  countryCode?: string;
  gender?: string;
  profileImg?: string;
  joinDate?: string;
  hasAccess?: boolean;
  registrationType: 'default' | 'phone' | 'email' | 'facebook' | 'google';
  status: string;
  success: boolean;
  isPasswordLess?: boolean;
  select?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAuthResponse {
  success: boolean;
  token?: string;
  tokenExpiredIn?: number;
  data?: any;
  message?: string;
}

export interface UserJwtPayload {
  _id?: string;
  username: string;
  shop: string;
}