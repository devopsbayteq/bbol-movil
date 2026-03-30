import {LoginRequestModel} from '../models/LoginRequestModel';
import {LoginResponseModel} from '../models/LoginResponseModel';

const MOCK_CREDENTIALS = {
  email: 'test@gmail.com',
  password: '123456',
};

const MOCK_USER_RESPONSE: LoginResponseModel = {
  id: '1',
  email: 'user@test.com',
  name: 'Test User',
  token: 'mock-jwt-token-xyz123',
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2026-03-28T08:00:00Z',
  role: 'customer',
  isActive: true,
  lastLoginAt: '2026-03-27T22:15:00Z',
};

const SIMULATED_DELAY_MS = 1500;

export class MockAuthDataSource {
  async login(request: LoginRequestModel): Promise<LoginResponseModel> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          request.email === MOCK_CREDENTIALS.email &&
          request.password === MOCK_CREDENTIALS.password
        ) {
          resolve(MOCK_USER_RESPONSE);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, SIMULATED_DELAY_MS);
    });
  }
}
