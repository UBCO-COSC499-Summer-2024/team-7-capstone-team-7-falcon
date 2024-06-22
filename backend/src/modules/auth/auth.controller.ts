import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ProviderAuthPipe } from './pipes/auth.pipe';
import { AuthService } from './auth.service';
import {
  EmployeeIdAlreadyExistsException,
  OAuthGoogleErrorException,
  StudentIdAlreadyExistsException,
  UserAlreadyExistsException,
  UserStudentEmployeeFieldException,
} from '../../common/errors';
import { CodeAuthPipe } from './pipes/code-auth.pipe';
import { AuthGuard } from '../../guards/auth.guard';
import { UserCreateDto } from './dto/user-create.dto';
import { UserService } from '../user/user.service';
import { AuthTypeEnum } from '../../enums/user.enum';

@Controller('auth')
export class AuthController {
  private GOOGLE_AUTH_URL: string =
    'https://accounts.google.com/o/oauth2/v2/auth';

  /**
   * Constructor
   * @param authService {AuthService} - The auth service
   * @param userService {UserService} - The user service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Register a new user
   * @param res {Response} - The response object
   * @param body {UserCreateDto} - The user create dto
   * @returns {Promise<Response>} - The response object
   */
  @Post('register')
  async register(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: UserCreateDto,
  ): Promise<Response> {
    try {
      await this.userService.findOrCreateUser(body, AuthTypeEnum.EMAIL);
      return res.status(HttpStatus.CREATED).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof UserAlreadyExistsException) {
        return res.status(HttpStatus.CONFLICT).send({ error: e.message });
      } else if (
        e instanceof UserStudentEmployeeFieldException ||
        e instanceof EmployeeIdAlreadyExistsException ||
        e instanceof StudentIdAlreadyExistsException
      ) {
        return res.status(HttpStatus.BAD_REQUEST).send({ error: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: e.message });
      }
    }
  }

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
        .cookie('auth_token', result.access_token, {
          httpOnly: true,
          secure: this.isSecure(),
        })
        .redirect(`${process.env.FRONTEND_URL}`);
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

  /**
   * Log out the user
   * @param res {Response} - The response object
   * @returns {Response}
   */
  @UseGuards(AuthGuard)
  @Get('logout')
  logout(@Res() res: Response): void {
    return res
      .clearCookie('auth_token', { httpOnly: true, secure: this.isSecure() })
      .redirect(`${process.env.FRONTEND_URL}/login`);
  }

  /**
   * Check if the application is running in a secure environment
   * @returns {boolean} - The result of the check
   */
  private isSecure(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}
