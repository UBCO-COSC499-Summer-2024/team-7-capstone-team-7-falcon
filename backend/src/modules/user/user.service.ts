import { Injectable } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { OAuthGoogleUserPayload } from '../../common/interfaces';
import { UserAlreadyExistsException } from '../../common/errors';
import { AuthTypeEnum } from '../../enums/user.enum';

@Injectable()
export class UserService {
  /**
   * Returns a user by id
   * @param id {number} - User id
   * @returns {Promise<UserModel>} - User object
   */
  public async getUserById(id: number): Promise<UserModel> {
    const user: UserModel = await UserModel.findOne({
      where: { id },
      relations: ['employee_user', 'student_user'],
    });

    if (!user) {
      return null;
    }

    // Remove password from user object as it is sensitive information
    delete user.password;

    return user;
  }

  /**
   * Returns a user by email
   * @param email {string} - User email
   * @returns {Promise<UserModel>} - User object
   */
  public async findOrCreateUser(
    userPayload: OAuthGoogleUserPayload,
    method: string,
  ): Promise<UserModel> {
    if (method === AuthTypeEnum.GOOGLE_OAUTH) {
      let user: UserModel = await UserModel.findOne({
        where: { email: userPayload.email },
      });

      if (!user) {
        const currentTime = parseInt(new Date().getTime().toString());

        user = new UserModel();
        user.email = userPayload.email;
        user.first_name = userPayload.given_name;
        user.last_name = userPayload.family_name;
        user.auth_type = AuthTypeEnum.GOOGLE_OAUTH;
        user.created_at = currentTime;
        user.updated_at = currentTime;

        await user.save();
      }

      if (user && user.auth_type !== AuthTypeEnum.GOOGLE_OAUTH) {
        throw new UserAlreadyExistsException();
      }

      return user;
    }

    throw new Error('Invalid auth method');
  }
}
