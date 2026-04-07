export interface LoginResponseModel {
  accessToken: string;
  firstName: string;
  sessionTimeSeconds: number;
  inactivityTimeoutSeconds: number;
}
