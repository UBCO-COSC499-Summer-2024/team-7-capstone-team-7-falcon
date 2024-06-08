import { Controller, HttpStatus, ParseIntPipe, Request } from '@nestjs/common';
import { Get, Param, Res, UseGuards } from '@nestjs/common/decorators';
import { Response } from 'express';
import { UserService } from './user.service';
import { ERROR_MESSAGES } from '../../common';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get information about user
   * @param req {Request} - Request object
   * @param res {Response} - Response object
   * @returns {Promise<Response>} - User object
   */
  @UseGuards(AuthGuard)
  @Get('/')
  async get(@Request() req: Request, @Res() res: Response): Promise<Response> {
    // req needs to be casted to any because the user property is not defined in the Request type by built in NestJS
    const user = await this.userService.getUserById((req as any).user.id);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.userController.userNotFound,
      });
    } else {
      return res.status(HttpStatus.OK).send(user);
    }
  }

  /**
   * Get user by id
   * @param res {Response} - Response object
   * @param uid {number} - User id
   * @returns {Promise<Response>} - User object
   */
  @UseGuards(AuthGuard)
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
  }
}
