import {PublicKey} from '../entities/PublicKey';

export interface SecurityRepository {
  getPublicKey(): Promise<PublicKey>;
}
