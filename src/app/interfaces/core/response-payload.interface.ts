export interface ResponsePayload {
  success: boolean;
  data?: any;
  count?: number;
  message?: string;
  token?: string;
}

export interface ImageUploadResponse {
  name: string;
  size: number;
  url: string;
  width: number;
  height: number;
}

