import {
<<<<<<< HEAD
  BadRequestException,
=======
>>>>>>> 16cce916afa18bd46395a5268d32ba695ffa7492
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CourseService } from '../modules/course/course.service';

@Injectable()
export class CourseRoleGuard implements CanActivate {
  /**
   * Constructor
   * @param reflector {Reflector} - The reflector {Reflector} instance
   * @param courseService {CourseService} - The course service {CourseService} instance
   */
  constructor(
    private reflector: Reflector,
    private readonly courseService: CourseService,
  ) {}

  /**
   * Method to check if the user has the required role in the course
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
      throw new UnauthorizedException();
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
