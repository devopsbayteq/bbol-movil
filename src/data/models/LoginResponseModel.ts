export interface LoginResponseModel {
  id: string;
  email: string;
  name: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
}
