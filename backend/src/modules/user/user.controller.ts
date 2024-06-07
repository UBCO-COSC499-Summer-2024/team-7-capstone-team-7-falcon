import { Controller, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { Get, Param, Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { UserService } from './user.service';
import { ERROR_MESSAGES } from 'src/common';
import { UserModel } from './entities/user.entity';
import { EmployeeUserModel } from './entities/employee-user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  get(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({
      message: 'ok',
    });
  }

  /**
   * Get user by id
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @returns {Promise<Response>} - User object
   */
  @Get('/:uid')
  async getById(
    @Res() res: Response,
    @Param('uid', ParseIntPipe) uid: number,
  ): Promise<Response> {
    const user = await this.userService.getUserById(uid);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.userController.userNotFound,
      });
    } else {
      return res.status(HttpStatus.OK).send(user);
    }

    // const user = await UserModel.create({
    //   first_name: 'John',
    //   last_name: 'Doe',
    //   email: 'john.doe1@test.com',
    //   password: 'password',
    //   created_at: 1_000_000_000,
    //   updated_at: 1_000_000_000,
    // }).save();

    // await EmployeeUserModel.create({
    //   user,
    //   employee_id: 1,
    // }).save();
    // return res.status(HttpStatus.OK).send(user);
  }
}
