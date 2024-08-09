import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { TokenModel } from '../token/entities/token.entity';
import { CourseUserModel } from '../course/entities/course-user.entity';
import { CourseModel } from '../course/entities/course.entity';
import { UserModel } from '../user/entities/user.entity';
import { StudentUserModel } from '../user/entities/student-user.entity';
import { EmployeeUserModel } from '../user/entities/employee-user.entity';
import { ExamModel } from '../exam/entities/exam.entity';
import { SubmissionModel } from '../exam/entities/submission.entity';
import { SemesterModel } from '../semester/entities/semester.entity';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { CourseRoleEnum, UserRoleEnum } from '../../enums/user.enum';
import { EnvironmentGuard } from '../../guards/environment.guard';
import { SubmissionDisputeModel } from '../exam/entities/submission-dispute.entity';

@UseGuards(EnvironmentGuard)
@Controller('seed')
export class SeedController {
  private readonly SALT_ROUNDS: number = 10;

  @Get('/reset')
  async reset(@Res() res: Response): Promise<Response> {
    await SubmissionModel.delete({});
    await TokenModel.delete({});
    await CourseUserModel.delete({});
    await ExamModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await StudentUserModel.delete({});
    await EmployeeUserModel.delete({});
    await SemesterModel.delete({});
    await SubmissionDisputeModel.delete({});

    await SubmissionDisputeModel.query(
      'ALTER SEQUENCE submission_dispute_model_id_seq RESTART WITH 1',
    );
    await SemesterModel.query(
      'ALTER SEQUENCE semester_model_id_seq RESTART WITH 1',
    );
    await ExamModel.query(`ALTER SEQUENCE exam_model_id_seq RESTART WITH 1`);
    await CourseModel.query(
      'ALTER SEQUENCE course_model_id_seq RESTART WITH 1',
    );
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await CourseUserModel.query(
      'ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1',
    );
    await TokenModel.query('ALTER SEQUENCE token_model_id_seq RESTART WITH 1');
    await StudentUserModel.query(
      'ALTER SEQUENCE student_user_model_id_seq RESTART WITH 1',
    );
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );
    await SubmissionModel.query(
      `ALTER SEQUENCE submission_model_id_seq RESTART WITH 1`,
    );

    return res.status(HttpStatus.OK).send({ message: 'Database reset' });
  }

  @Get('/')
  async seed(@Res() res: Response): Promise<Response> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash('seed', salt);

    // Create users
    const student = await UserModel.create({
      email: 'student@owlmark.com',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      email_verified: true,
      password: hashedPassword,
    }).save();

    const studentTwo = await UserModel.create({
      email: 'student2@owlmark.com',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      email_verified: true,
      password: hashedPassword,
    }).save();

    const studentThree = await UserModel.create({
      email: 'student3@owlmark.com',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      email_verified: true,
      password: hashedPassword,
    }).save();

    const professor = await UserModel.create({
      email: 'professor@owlmark.com',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      email_verified: true,
      password: hashedPassword,
      role: UserRoleEnum.PROFESSOR,
    }).save();

    const admin = await UserModel.create({
      email: 'admin@owlmark.com',
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      email_verified: true,
      password: hashedPassword,
      role: UserRoleEnum.ADMIN,
    }).save();

    await EmployeeUserModel.create({
      user: professor,
      employee_id: faker.number.int({ min: 1_000, max: 9_999 }),
    }).save();

    const studentUser = await StudentUserModel.create({
      user: student,
      student_id: faker.number.int({ min: 1_000, max: 9_999 }),
    }).save();

    await StudentUserModel.create({
      user: studentTwo,
      student_id: faker.number.int({ min: 1_000, max: 9_999 }),
    }).save();

    await StudentUserModel.create({
      user: studentThree,
      student_id: faker.number.int({ min: 1_000, max: 9_999 }),
    }).save();

    await EmployeeUserModel.create({
      user: admin,
      employee_id: faker.number.int({ min: 1_000, max: 9_999 }),
    }).save();

    // Create semester
    const semester = await SemesterModel.create({
      name: 'Summer 2024',
      starts_at: parseInt(new Date().getTime().toString()),
      ends_at: parseInt(new Date().getTime().toString()) + 50_000,
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
    }).save();

    // Create course
    const course = await CourseModel.create({
      course_code: 'COSC 499',
      course_name: 'Capstone Project',
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      section_name: '001',
      invite_code: '123',
      semester: semester,
    }).save();

    await CourseUserModel.create({
      user: student,
      course,
      course_role: CourseRoleEnum.STUDENT,
    }).save();

    await CourseUserModel.create({
      user: studentTwo,
      course,
      course_role: CourseRoleEnum.STUDENT,
    }).save();

    await CourseUserModel.create({
      user: professor,
      course,
      course_role: CourseRoleEnum.PROFESSOR,
    }).save();

    // Create an exam
    const exam = await ExamModel.create({
      course,
      name: 'Final Exam',
      exam_date: parseInt(new Date().getTime().toString()) + 10_000,
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      questions: {},
      grades_released_at: parseInt(new Date().getTime().toString()),
    }).save();

    await ExamModel.create({
      course,
      name: 'Midterm Exam',
      exam_date: parseInt(new Date().getTime().toString()) + 10_000,
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      questions: {},
      grades_released_at: -1,
    }).save();

    await SubmissionModel.create({
      exam,
      student: null,
      answers: {
        errorFlag: true,
        answer_list: [
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
        ],
      },
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      document_path: 'seed/submission.pdf',
      score: 100,
    }).save();

    await SubmissionModel.create({
      exam,
      student: studentUser,
      answers: {
        errorFlag: false,
        answer_list: [
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 0 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 0 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 0 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 0 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 0 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
          { question_num: 0, expected: [1, 2], answered: [1, 2], score: 1 },
        ],
      },
      created_at: parseInt(new Date().getTime().toString()),
      updated_at: parseInt(new Date().getTime().toString()),
      document_path: 'seed/submission.pdf',
      score: 50,
    }).save();

    return res.status(HttpStatus.OK).send({ message: 'Database seeded' });
  }
}
