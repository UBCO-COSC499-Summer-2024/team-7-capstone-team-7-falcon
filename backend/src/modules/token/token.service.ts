import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { TokenTypeEnum } from '../../enums/token-type.enum';
import { TokenModel } from './entities/token.entity';
import { Not } from 'typeorm';
import {
  TokenExpiredException,
  TokenInvalidException,
} from '../../common/errors';
import { UserService } from '../user/user.service';
import { validate as isUuid } from 'uuid';

@Injectable()
export class TokenService {
  private readonly THREE_HOURS = 3 * 60 * 60 * 1000;

  /**
   * Constructor of TokenService
   * @param userService {UserService} - The user service
   */
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

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

  /**
   * Updates the token based on the token type
   * @param token {string} - The token to update
   * @param tokenResponse {TokenModel} [optional] - The token response to update
   */
  async update(token: string, tokenResponse?: TokenModel): Promise<void> {
    const tokenModel = tokenResponse
      ? tokenResponse
      : await this.findTokenAndUser(token);

    switch (tokenModel.type) {
      case TokenTypeEnum.EMAIL_VERIFICATION:
        await this.verifyUserEmail(tokenModel);
        break;
      case TokenTypeEnum.PASSWORD_RESET:
        await tokenModel.expireToken();
        break;
    }
  }

  /**
   * Finds a token and its associated user
   * @param token {string} - The token to find
   * @returns {Promise<TokenModel>} - The token and its associated user
   */
  async findTokenAndUser(token: string): Promise<TokenModel> {
    if (!isUuid(token)) {
      throw new TokenInvalidException();
    }

    const tokenResponse = await TokenModel.findOne({
      where: {
        token,
        expires_at: Not(-1), // If expires_at is -1, the token has been used
      },
      relations: ['user'],
    });

    if (!tokenResponse) {
      throw new TokenInvalidException();
    }

    const currentTime = parseInt(new Date().getTime().toString());

    if (tokenResponse.expires_at < currentTime) {
      throw new TokenExpiredException();
    }

    return tokenResponse;
  }

  /**
   * Verifies the user's email
   * @param token {TokenModel} - The token to verify
   */
  private async verifyUserEmail(token: TokenModel): Promise<void> {
    await this.userService.verifyEmail(token.user);

    await token.expireToken();
  }
}
