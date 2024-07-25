import { Injectable } from '@nestjs/common';
import { SemesterDto } from './dto/semester.dto';
import {
  SemesterCreationException,
  SemesterNotFoundException,
} from '../../common/errors';
import { ERROR_MESSAGES } from '../../common';
import { SemesterModel } from './entities/semester.entity';
import { MoreThan } from 'typeorm';
import { CourseModel } from '../course/entities/course.entity';

@Injectable()
export class SemesterService {
  private readonly TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
  private readonly THREE_MONTHS = 3 * 30 * 24 * 60 * 60 * 1000;

  /**
   * Get all semesters
   * @returns {Promise<SemesterModel[]>} - The promise object
   */
  public async getAllSemestersLimited(): Promise<SemesterModel[]> {
    const dateThreeMonthsAgo: number =
      parseInt(new Date().getTime().toString()) - this.THREE_MONTHS;

    const result = await SemesterModel.find({
      where: { starts_at: MoreThan(dateThreeMonthsAgo) },
      select: ['id', 'name'],
    });

    if (!result || result.length === 0) {
      return null;
    }

    return result;
  }

  /**
   * Get all semesters and their course count
   * @returns {Promise<SemesterModel[]>} - The promise object
   */
  public async getAllSemesters(): Promise<SemesterModel[]> {
    const semesters = await SemesterModel.createQueryBuilder('semester')
      .loadRelationCountAndMap('semester.course_count', 'semester.courses')
      .getMany();

    return semesters;
  }

  /**
   * Create a new semester
   * @param semesterDetails {SemesterDto} - The semester details
   * @returns {Promise<void>} - The promise object
   */
  public async createSemester(semesterDetails: SemesterDto): Promise<void> {
    if (semesterDetails.starts_at >= semesterDetails.ends_at) {
      throw new SemesterCreationException(
        ERROR_MESSAGES.semesterController.semesterStartDateMustBeBeforeEndDate,
      );
    }

    const currentDate: number = parseInt(new Date().getTime().toString());

    if (semesterDetails.starts_at <= currentDate - this.TWO_DAYS) {
      throw new SemesterCreationException(
        ERROR_MESSAGES.semesterController.semesterStartDateMustBeTwoDaysAhead,
      );
    }

    await SemesterModel.create({
      ...semesterDetails,
      created_at: currentDate,
      updated_at: currentDate,
    }).save();

    return;
  }

  /**
   * Update a semester
   * @param sid {number} - The semester id
   * @param semesterDetails {SemesterDto} - The semester details
   * @returns {Promise<void>} - The promise object
   */
  public async updateSemester(
    sid: number,
    semesterDetails: SemesterDto,
  ): Promise<void> {
    const semester = await SemesterModel.findOne({ where: { id: sid } });

    if (!semester) {
      throw new SemesterNotFoundException();
    }

    if (semesterDetails.starts_at >= semesterDetails.ends_at) {
      throw new SemesterCreationException(
        ERROR_MESSAGES.semesterController.semesterStartDateMustBeBeforeEndDate,
      );
    }

    await SemesterModel.update(sid, {
      ...semesterDetails,
      updated_at: parseInt(new Date().getTime().toString()),
    });

    return;
  }

  /**
   * Get a semester by id
   * @param sid {number} - The semester id
   * @returns {Promise<SemesterModel>} - The promise object
   */
  public async getSemesterById(sid: number): Promise<SemesterModel> {
    const semester = await SemesterModel.findOne({ where: { id: sid } });

    if (!semester) {
      throw new SemesterNotFoundException();
    }

    return semester;
  }

  /**
   * Delete a semester
   * @param sid {number} - The semester id
   * @returns {Promise<void>} - The promise object
   */
  public async deleteSemester(sid: number): Promise<void> {
    const semester = await this.getSemesterById(sid);

    await CourseModel.update({ semester: semester }, { semester: null });

    await semester.remove();
  }
}
