import { SetMetadata, CustomDecorator } from '@nestjs/common';

/**
 * Decorator to set roles
 * @param roles {string[]} - The roles to set
 * @returns {CustomDecorator<string>} - The custom decorator
 */
export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
