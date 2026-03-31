import {User} from '../../domain/entities/User';
import {AuthRepository} from '../../domain/repositories/AuthRepository';
import {AuthDataSource} from '../datasources/auth/AuthDataSource';
import {mapLoginResponseToUser} from '../mappers/UserMapper';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthDataSource) {}

  async login(email: string, password: string): Promise<User> {
    const response = await this.dataSource.login({username: email, password});
    return mapLoginResponseToUser(response, email);
  }
}
