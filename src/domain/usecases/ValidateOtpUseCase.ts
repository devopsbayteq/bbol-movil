import {SecurityRepository} from '../repositories/SecurityRepository';
import {Otp} from "../entities/Otp.ts";

export class ValidateOtpUseCase {
    constructor(
        private readonly securityRepository: SecurityRepository,
    ) {
    }

    async execute(otp: string): Promise<Otp> {
        return await this.securityRepository.validateOtp(otp);
    }
}
