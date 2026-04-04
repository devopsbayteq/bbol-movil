import {LoginResponseModel} from '../models/LoginResponseModel';
import {User} from '../../domain/entities/User';

export function mapLoginResponseToUser(
  model: LoginResponseModel,
  email: string,
): User {
  return {
    id: email,
    email,
    name: email.split('@')[0] || 'User',
    token: model.accessToken,
    sessionExpiresAt: Date.now() + (model.sessionTimeSeconds/100) * 1000,
    inactivityTimeoutSeconds: model.inactivityTimeoutSeconds,
  };
}
