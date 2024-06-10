import { Controller, HttpStatus } from '@nestjs/common';
import { Get, Res } from '@nestjs/common/decorators';
import { Response } from 'express';

@Controller('health')
export class HealthController {
  @Get('/')
  get(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({
      message: 'ok',
    });
  }
}
