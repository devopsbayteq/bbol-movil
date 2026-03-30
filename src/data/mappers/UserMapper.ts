import {LoginResponseModel} from '../models/LoginResponseModel';
import {User} from '../../domain/entities/User';

export function mapLoginResponseToUser(model: LoginResponseModel): User {
  return {
    id: model.id,
    email: model.email,
    name: model.name,
    token: model.token,
  };
}
