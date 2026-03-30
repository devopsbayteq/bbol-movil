import {User} from '../../domain/entities/User';
import {AuthRepository} from '../../domain/repositories/AuthRepository';
import {MockAuthDataSource} from '../datasources/MockAuthDataSource';
import {mapLoginResponseToUser} from '../mappers/UserMapper';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: MockAuthDataSource) {}

  async login(email: string, password: string): Promise<User> {
    const response = await this.dataSource.login({email, password});
    return mapLoginResponseToUser(response);
  }
}
