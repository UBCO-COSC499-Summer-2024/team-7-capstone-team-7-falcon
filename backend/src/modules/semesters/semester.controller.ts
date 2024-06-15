import {
  Body,
  Controller,
  Get,
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
import { ERROR_MESSAGES } from '../../common';

@Controller('semester')
export class SemesterController {
  /**
   * Constructor of SemesterController
   * @param semesterService {SemesterService} - The semester service
   */
  constructor(private readonly semesterService: SemesterService) {}

  /**
   * Get all semesters
   * @param res {Response} - The response object
   * @returns {Promise<Response>} - The response object with semesters or error message
   */
  @UseGuards(AuthGuard)
  @Get('all')
  async getAll(@Res() res: Response) {
    const semesters = await this.semesterService.getAllSemesters();

    if (!semesters) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.semesterController.semestersNotFound,
      });
    }

    return res.status(HttpStatus.OK).send(semesters);
  }

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
