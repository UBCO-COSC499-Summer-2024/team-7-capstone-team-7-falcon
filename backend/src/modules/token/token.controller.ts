import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { Response } from 'express';
import { TokenDto } from './dto/token.dto';
import {
  TokenExpiredException,
  TokenInvalidException,
} from '../../common/errors';

@Controller('token')
export class TokenController {
  /**
   * Constructor of TokenController
   * @param tokenService {TokenService} Service for token
   */
  constructor(private readonly tokenService: TokenService) {}

  /**
   * Updates the token
   * @param res {Response} - The response object
   * @param body {TokenDto} - The token to update
   * @returns {Promise<Response>} - The response object
   */
  @Patch('/')
  async update(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: TokenDto,
  ): Promise<Response> {
    try {
      await this.tokenService.update(body.token);

      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof TokenInvalidException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else if (e instanceof TokenExpiredException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Validates the token
   * @param res {Response} - The response object
   * @param tid {string} - The token id
   * @returns {Promise<Response>} - The response object
   */
  @Get('/:tid/validate')
  async validate(
    @Res() res: Response,
    @Param('tid') tid: string,
  ): Promise<Response> {
    try {
      await this.tokenService.findTokenAndUser(tid);

      return res.status(HttpStatus.FOUND).send();
    } catch (e) {
      if (e instanceof TokenInvalidException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else if (e instanceof TokenExpiredException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: 'Internal server error' });
      }
    }
  }
}
