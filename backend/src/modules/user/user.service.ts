import { Injectable } from '@nestjs/common';
import { UserModel } from './entities/user.entity';

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
}
