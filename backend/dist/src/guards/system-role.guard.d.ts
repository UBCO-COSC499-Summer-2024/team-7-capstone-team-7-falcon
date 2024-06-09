import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "../modules/user/user.service";
export declare class SystemRoleGuard implements CanActivate {
  private reflector;
  private readonly userService;
  constructor(reflector: Reflector, userService: UserService);
  canActivate(context: ExecutionContext): Promise<boolean>;
  private validateUserRole;
  private hasRole;
}
