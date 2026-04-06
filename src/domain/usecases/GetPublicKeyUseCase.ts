import {normalizePemKeyMaterialBase64} from '../../security/certificate/rsaUtils';
import {PublicKey} from '../entities/PublicKey';
import {SecurityRepository} from '../repositories/SecurityRepository';
import {SecureStorageService} from '../services/SecureStorageService';

export class GetPublicKeyUseCase {
  constructor(
    private readonly securityRepository: SecurityRepository,
    private readonly secureStorage: SecureStorageService,
    private readonly storageKey: string,
  ) {}

  async execute(): Promise<PublicKey> {
    const publicKey = await this.securityRepository.getPublicKey();
    const trimmed = publicKey.value.trim();
    if (!trimmed) {
      throw new Error('La clave pública recibida no es válida');
    }
    const pemBase64 = normalizePemKeyMaterialBase64(trimmed);
    await this.secureStorage.save(this.storageKey, pemBase64);
    return {value: pemBase64};
  }
}
