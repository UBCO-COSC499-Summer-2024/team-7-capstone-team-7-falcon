import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class EnvironmentGuard implements CanActivate {
  /**
   * Checks if the application is running in production mode
   * @returns {Promise<boolean>} - The result of the check
   * @throws {NotFoundException} - Throws a 404 error if the application is running in production mode
   */
  async canActivate(): Promise<boolean> {
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    throw new NotFoundException();
  }
}
