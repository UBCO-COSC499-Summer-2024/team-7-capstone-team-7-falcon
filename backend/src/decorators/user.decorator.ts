import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserModel } from '../modules/user/entities/user.entity';

export const User = createParamDecorator<string[]>(
  /**
   * Get user from request
   * @param relations {string[]} - Relations to include
   * @param ctx {ExecutionContext} - Execution context
   * @returns {Promise<UserModel>} - User object
   */
  async (relations: string[], ctx: ExecutionContext): Promise<UserModel> => {
    const request = ctx.switchToHttp().getRequest();

    return await UserModel.findOne({
      where: { id: request.user.id },
      relations,
    });
  },
);
