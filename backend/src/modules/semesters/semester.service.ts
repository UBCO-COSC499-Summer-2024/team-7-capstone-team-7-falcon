import { Injectable } from '@nestjs/common';
import { SemesterCreateDto } from './dto/semester-create.dto';
import { SemesterCreationException } from '../../common/errors';
import { ERROR_MESSAGES } from '../../common';
import { SemesterModel } from './entities/semester.entity';
import { MoreThan } from 'typeorm';

@Injectable()
export class SemesterService {
  private readonly TWO_DAYS = 2 * 24 * 60 * 60 * 1000;
  private readonly THREE_MONTHS = 3 * 30 * 24 * 60 * 60 * 1000;

  /**
   * Get all semesters
   * @returns {Promise<SemesterModel[]>} - The promise object
   */
  public async getAllSemesters(): Promise<SemesterModel[]> {
    const dateThreeMonthsAgo: number =
      parseInt(new Date().getTime().toString()) - this.THREE_MONTHS;

    const result = await SemesterModel.find({
      where: { starts_at: MoreThan(dateThreeMonthsAgo) },
    });

    if (!result || result.length === 0) {
      return null;
    }

    return result;
  }

  /**
   * Create a new semester
   * @param semesterDetails {SemesterCreateDto} - The semester details
   * @returns {Promise<void>} - The promise object
   */
  public async createSemester(
    semesterDetails: SemesterCreateDto,
  ): Promise<void> {
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
}
