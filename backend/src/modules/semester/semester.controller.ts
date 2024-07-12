import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { SystemRoleGuard } from '../../guards/system-role.guard';
import { SemesterDto } from './dto/semester.dto';
import { Roles } from '../../decorators/roles.decorator';
import { UserRoleEnum } from '../../enums/user.enum';
import { SemesterService } from './semester.service';
import { Response } from 'express';
import {
  SemesterCreationException,
  SemesterNotFoundException,
} from '../../common/errors';
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
  @Get('/limited/all')
  async getAllLimited(@Res() res: Response): Promise<Response> {
    const semesters = await this.semesterService.getAllSemestersLimited();

    if (!semesters) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: ERROR_MESSAGES.semesterController.semestersNotFound,
      });
    }

    return res.status(HttpStatus.OK).send(semesters);
  }

  /**
   * Get all semesters
   * @param res {Response} - The response object
   * @returns {Promise<Response>} - The response object with semesters or error message
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('/all')
  async getAll(@Res() res: Response): Promise<Response> {
    try {
      const semesters = await this.semesterService.getAllSemesters();

      if (semesters.length === 0) {
        return res.status(HttpStatus.NO_CONTENT).send();
      }

      return res.status(HttpStatus.OK).send(semesters);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: e.message,
      });
    }
  }

  /**
   * Create a new semester
   * @param res {Response} - The response object
   * @param body {SemesterCreateDto} - The semester details
   * @returns {Promise<Response>} - The response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Post('/create')
  async post(
    @Res() res: Response,
    @Body(new ValidationPipe()) body: SemesterDto,
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

  /**
   * Update semester details by id
   * @param res {Response} - The response object
   * @param sid {number} - The semester id {sid
   * @param body {SemesterDto} - The semester details {body
   * @returns {Promise<Response>} - The response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Patch('/:sid')
  async update(
    @Res() res: Response,
    @Param('sid', ParseIntPipe) sid: number,
    @Body(new ValidationPipe()) body: SemesterDto,
  ): Promise<Response> {
    try {
      await this.semesterService.updateSemester(sid, body);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      if (e instanceof SemesterNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: e.message,
        });
      } else if (e instanceof SemesterCreationException) {
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

  /**
   * Get semester by id
   * @param res {Response} - The response object {res
   * @param sid {number} - The semester id
   * @returns {Promise<Response>} - The response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.ADMIN)
  @Get('/:sid')
  async getSemesterById(
    @Res() res: Response,
    @Param('sid', ParseIntPipe) sid: number,
  ): Promise<Response> {
    try {
      const semester = await this.semesterService.getSemesterById(sid);
      return res.status(HttpStatus.OK).send(semester);
    } catch (e) {
      if (e instanceof SemesterNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({
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
