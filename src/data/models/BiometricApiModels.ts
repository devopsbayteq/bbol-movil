export interface BiometricChallengeRequest {
  userEncryptBase64: string;
}

export interface BiometricChallengeContent {
  challenge: string;
}

export interface BiometricRegistrationRequest {
  challenge: string;
  challengeSignBase64: string;
  mobilePublicKeyBase64: string;
}

export interface BiometricLoginRequest {
  usernameEncryptBase64: string;
  challenge: string;
  challengeSignBase64: string;
}

export interface BiometricLoginContent {
  accessToken: string;
}
