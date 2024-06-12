import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { getCookie } from '../common/helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructor
   * @param jwtService {JwtService} - The JWT service
   */
  constructor(private jwtService: JwtService) {}

  /**
   * Check if the request is authorized
   * @param context {ExecutionContext} - The context of the request
   * @returns {Promise<boolean>} - The result of the check
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
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
}
