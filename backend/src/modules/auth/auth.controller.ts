import { Controller, Get, HttpStatus, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProviderAuthPipe } from './pipes/auth.pipe';
import { AuthService } from './auth.service';
import {
  OAuthGoogleErrorException,
  UserAlreadyExistsException,
} from '../../common/errors';
import { CodeAuthPipe } from './pipes/code-auth.pipe';

@Controller('auth')
export class AuthController {
  private GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

  constructor(private readonly authService: AuthService) {}

  /**
   * Redirect to the OAuth provider
   * @param res {Response} - The response object
   * @param _provider {string} - The provider to redirect to
   * @returns {void}
   */
  @Get('oauth/:provider')
  oAuthProviderNegotiation(
    @Res() res: Response,
    // Using no-unused-vars because we need to use the pipe and we only have one provider
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('provider', ProviderAuthPipe) _provider: string,
  ): void {
    return res
      .status(HttpStatus.PERMANENT_REDIRECT)
      .redirect(
        `${this.GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}.apps.googleusercontent.com&response_type=` +
          `code&scope=openid%20profile%20email&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&state=google`,
      );
  }

  /**
   * Redirect to the OAuth provider
   * @param res {Response} - The response object
   * @param _provider {string} - The provider to redirect to
   * @returns {Promise<Response>} - The response object
   */
  @Get('oauth/:provider/callback')
  async oAuthProviderCallback(
    @Res() res: Response,
    // Using no-unused-vars because we need to use the pipe and we only have one provider
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('provider', ProviderAuthPipe) _provider: string,
    @Query('code', CodeAuthPipe) code: string,
  ): Promise<Response<void> | void> {
    try {
      const result = await this.authService.signInWithGoogle(code);
      return res
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect(`${process.env.FRONTEND_URL}/?token=${result.access_token}`);
    } catch (e) {
      if (e instanceof OAuthGoogleErrorException) {
        return res.status(HttpStatus.UNAUTHORIZED).send({ error: e.message });
      } else if (e instanceof UserAlreadyExistsException) {
        return res.status(HttpStatus.CONFLICT).send({ error: e.message });
      } else if (e instanceof Error) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: e.message });
      }
    }
  }
}
