import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../modules/user/user.service';
import { UserRoleEnum } from '../enums/user.enum';

@Injectable()
export class SystemRoleGuard implements CanActivate {
  /**
   * Constructor
   * @param reflector {Reflector} - The reflector {Reflector} instance
   * @param userService {UserService} - The user service {UserService} instance
   */
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  /**
   * Method to check if the user has the required role
   * @param context {ExecutionContext} - The execution context
   * @returns {Promise<boolean>} - The boolean result
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return this.validateUserRole(request.user, roles);
  }

  /**
   * Method to validate the user role
   * @param user {object} - The user object { id: number }
   * @param roles {string[]} - The roles to validate
   * @returns {Promise<boolean>} - The boolean result
   */
  private async validateUserRole(
    user: { id: number },
    roles: string[],
  ): Promise<boolean> {
    const userAccount = await this.userService.getUserById(user.id);

    if (!userAccount) {
      throw new UnauthorizedException();
    }

    if (this.hasRole(userAccount.role, roles)) {
      return true;
    }

    throw new UnauthorizedException();
  }

  /**
   * Method to check if the user has the required role
   * @param userRole {UserRoleEnum} - The user role
   * @param roles {string[]} - The roles to check
   * @returns {boolean} - The boolean result
   */
  private hasRole(userRole: UserRoleEnum, roles: string[]): boolean {
    return roles.includes(userRole);
  }
}
