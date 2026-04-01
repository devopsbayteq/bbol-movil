import { Otp } from '../entities/Otp';
import {PublicKey} from '../entities/PublicKey';

export interface SecurityRepository {
  getPublicKey(): Promise<PublicKey>;
  validateOtp(otp:string):Promise<Otp>;
}
