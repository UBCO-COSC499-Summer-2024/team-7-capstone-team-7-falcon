import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../enums/user.enum';
import { CourseService } from '../../src/modules/course/course.service';
import { UserService } from '../../src/modules/user/user.service';

@Injectable()
export class EditCourseGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  /**
   * Method to check if the user has the required role in the course or the user role is ADMIN
   * @param context {ExecutionContext} - The execution context
   * @returns {Promise<boolean>} - The boolean result
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      throw new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();
    const userId = request['user'].id;

    const { cid } = request.params;

    if (isNaN(cid)) {
      throw new BadRequestException();
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.role === UserRoleEnum.ADMIN) {
      return true;
    }

    return this.validateUserCourseRole(cid, userId, roles);
  }

  /**
   * Validate user course role
   * @param cid {number} - Course id
   * @param userId {number} - User id
   * @param roles {string[]} - Roles
   * @returns {Promise<boolean>} - True if user has role, false otherwise
   */
  private async validateUserCourseRole(
    cid: number,
    userId: number,
    roles: string[],
  ): Promise<boolean> {
    const userCourse = await this.courseService.getUserByCourseAndUserId(
      cid,
      userId,
    );

    if (!userCourse) {
      throw new NotFoundException();
    }

    if (this.hasRole(userCourse.course_role, roles)) {
      return true;
    }

    throw new UnauthorizedException();
  }

  /**
   * Check if user has role
   * @param userRole {string} - User role
   * @param roles {string[]} - Roles
   * @returns {boolean} - True if user has role, false otherwise
   */
  private hasRole(userRole: string, roles: string[]): boolean {
    return roles.includes(userRole);
  }
}
