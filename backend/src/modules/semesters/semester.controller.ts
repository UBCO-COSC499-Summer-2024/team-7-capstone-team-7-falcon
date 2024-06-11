import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { SystemRoleGuard } from '../../guards/system-role.guard';
import { SemesterCreateDto } from './dto/semester-create.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserRoleEnum } from '../../enums/user.enum';
import { SemesterService } from './semester.service';
import { Response } from 'express';
import { SemesterCreationException } from '../../common/errors';

@Controller('semester')
export class SemesterController {
  /**
   * Constructor of SemesterController
   * @param semesterService {SemesterService} - The semester service
   */
  constructor(private readonly semesterService: SemesterService) {}

  /**
   * Create a new semester
   * @param res {Response} - The response object
   * @param body {SemesterCreateDto} - The semester details
   * @returns {Promise<Response>} - The response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post('create')
  async post(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: SemesterCreateDto,
  ): Promise<Response> {
    try {
      await this.semesterService.createSemester(body);
      return res.status(HttpStatus.CREATED).send({
        message: 'ok',
      });
    } catch (e) {
      if (e instanceof SemesterCreationException) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: e.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
          message: e.message,
        });
      }
    }
  }
}
