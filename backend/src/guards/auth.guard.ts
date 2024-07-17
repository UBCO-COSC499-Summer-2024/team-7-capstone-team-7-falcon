import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { getCookie } from '../common/helpers';
import { UserService } from '../modules/user/user.service';
import { AuthTypeEnum } from '../enums/user.enum';
import { ERROR_MESSAGES } from '../common';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructor
   * @param jwtService {JwtService} - The JWT service
   * @param userService {UserService} - The user service
   */
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * Check if the request is authorized
   * @param context {ExecutionContext} - The context of the request
   * @returns {Promise<boolean>} - The result of the check
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      this.extractTokenFromHeader(request) ??
      this.extractTokenFromRawHeaders(request.rawHeaders);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    // Validate if the email is verified
    await this.validateEmailVerified(request);
    // Validate if the student or employee id is present
    await this.validateStudentEmployeeIdProvided(request);

    return true;
  }

  /**
   * Extracts the token from the request header
   * @param request {Request} - The request object
   * @returns {string | undefined} - The token or undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const auth_token = getCookie(request, 'auth_token');

    return auth_token ? auth_token : undefined;
  }

  /**
   * Extracts the token from the raw headers
   * @param rawHeaders {string[]} - The raw headers
   * @returns {string | undefined} - The token or undefined
   */
  private extractTokenFromRawHeaders(rawHeaders: string[]): string | undefined {
    const auth_token = rawHeaders.find((header) =>
      header.includes('auth_token'),
    );

    return auth_token ? auth_token.split('=')[1] : undefined;
  }

  /**
   * Validates if the email is verified
   * @param request {Request} - The request object
   */
  private async validateEmailVerified(request: Request): Promise<void> {
    const user = await this.userService.getUserById(request['user'].id);
    // Additional check to ensure that the user exists
    if (!user) {
      throw new UnauthorizedException();
    }

    // We should only raise an error if the user is trying to login with AuthType that requires email & password only
    if (!user.email_verified && user.auth_type === AuthTypeEnum.EMAIL) {
      // Frontend should redirect to the email verification page based on the Forbidden status code
      throw new ForbiddenException({
        message: ERROR_MESSAGES.authController.emailNotVerified,
        errorCode: 'EMAIL_NOT_VERIFIED',
      });
    }
  }

  private async validateStudentEmployeeIdProvided(
    request: Request,
  ): Promise<void> {
    const user = await this.userService.getUserById(request['user'].id);
    // Additional check to ensure that the user exists
    if (!user) {
      throw new UnauthorizedException();
    }

    // Allow PATCH request to update user details. PATH must be /user/{id}
    // Allow GET request to logout user if the path is /auth/logout
    if (
      (request.method === 'PATCH' && request.path.match(/\/user\/[1-9]$/)) ||
      (request.method === 'GET' && request.path === '/auth/logout')
    )
      return;

    if (!user.student_user && !user.employee_user) {
      throw new ForbiddenException({
        message: ERROR_MESSAGES.authController.studentOrEmployeeIdNotPresent,
        errorCode: 'STUDENT_OR_EMPLOYEE_ID_NOT_PRESENT',
      });
    }
  }
}
