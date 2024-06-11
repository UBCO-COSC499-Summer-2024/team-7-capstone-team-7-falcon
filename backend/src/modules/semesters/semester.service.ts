import { Injectable } from '@nestjs/common';
import { SemesterCreateDto } from './dto/semester-create.dto';
import { SemesterCreationDateException } from '../../common/errors';
import { ERROR_MESSAGES } from '../../common';
import { SemesterModel } from './entities/semester.entity';

@Injectable()
export class SemesterService {
  private readonly TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

  /**
   * Create a new semester
   * @param semesterDetails {SemesterCreateDto} - The semester details
   * @returns {Promise<void>} - The promise object
   */
  public async createSemester(
    semesterDetails: SemesterCreateDto,
  ): Promise<void> {
    if (semesterDetails.starts_at >= semesterDetails.ends_at) {
      throw new SemesterCreationDateException(
        ERROR_MESSAGES.semesterController.semesterStateDateMustBeBeforeEndDate,
      );
    }

    const currentDate: number = parseInt(new Date().getTime().toString());

    if (semesterDetails.starts_at <= currentDate - this.TWO_DAYS) {
      throw new SemesterCreationDateException(
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
