import { Injectable } from '@nestjs/common';
import { TokenTypeEnum } from '../../enums/token-type.enum';
import { TokenModel } from './entities/token.entity';

@Injectable()
export class TokenService {
  private readonly THREE_HOURS = 3 * 60 * 60 * 1000;

  /**
   * Creates a token based on the token type and expiration time
   * @param tokenType {TokenTypeEnum} - The type of token to create
   * @param expiresIn {number} - The time in milliseconds until the token expires
   * @returns {Promise<TokenModel>} - The created token
   */
  async createToken(
    tokenType: TokenTypeEnum = TokenTypeEnum.EMAIL_VERIFICATION,
    expiresIn: number = this.THREE_HOURS,
  ): Promise<TokenModel> {
    const currentTime = parseInt(new Date().getTime().toString());

    const token = await TokenModel.create({
      type: tokenType,
      created_at: currentTime,
      expires_at: currentTime + expiresIn,
    }).save();

    return token;
  }
}
