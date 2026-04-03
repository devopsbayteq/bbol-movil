export interface LoginResponseModel {
  accessToken: string;
  sessionTimeSeconds: number;
  inactivityTimeoutSeconds: number;
}
