import { HttpStatus } from '@nestjs/common';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import {
  AuthTypeEnum,
  CourseRoleEnum,
  UserRoleEnum,
} from '../src/enums/user.enum';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';
import { TokenModel } from '../src/modules/token/entities/token.entity';
import { TokenTypeEnum } from '../src/enums/token-type.enum';
import * as bcrypt from 'bcrypt';
import { TestingModuleBuilder } from '@nestjs/testing';
import { MailService } from '../src/modules/mail/mail.service';

describe('User Integration', () => {
  const supertest = setUpIntegrationTests(
    UserModule,
    (t: TestingModuleBuilder) =>
      t.overrideProvider(MailService).useValue({
        sendPasswordReset: jest.fn().mockResolvedValue(Promise.resolve()),
      }),
  );

  beforeEach(async () => {
    await TokenModel.delete({});
    await CourseUserModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});
    await StudentUserModel.delete({});

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
  });

  describe('GET /user', () => {
    it('should return status 401 when user not authenticated', () => {
      return supertest().get('/user').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 200 and user object', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      const response = await supertest()
        .get('/user')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('GET /user/:uid', () => {
    it('should return status 401 when user not authenticated', () => {
      return supertest().get('/user/1').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 when user is not an admin', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .get('/user/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 when uid is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .get('/user/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 200 and user object', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      const response = await supertest()
        .get(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(1)}`]);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchSnapshot();
    });

    it("should return status 404 when user id doesn't exist", async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .get('/user/100')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });
  });

  describe('PATCH /user/:uid', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().patch('/user/1').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 when uid is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .patch('/user/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 400 when first_name is not provided', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .patch(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: [
            'First name must be between 2 and 15 characters',
            'First name is required',
            'First name must be a string',
          ],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return 403 when user is not allowed to edit another user', async () => {
      const userOne = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .patch(`/user/${userTwo.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(userOne.id)}`])
        .send({ first_name: 'John' })
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          message: 'You are not allowed to edit this user',
        });
    });

    it('should return status 200 when user updated', async () => {
      const user = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const response = await supertest()
        .patch(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ first_name: 'John' });

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return status 200 when user is admin and updates another user', async () => {
      const userOne = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        role: UserRoleEnum.ADMIN,
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .patch(`/user/${userTwo.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(userOne.id)}`])
        .send({ first_name: 'John' })
        .expect(HttpStatus.OK)
        .expect({
          message: 'ok',
        });
    });

    it('should return status 404 when user id does not exist', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      return supertest()
        .patch('/user/100')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ first_name: 'John' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });

    it('should return status 409 when employee_id already exists', async () => {
      const userOne = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const employeeIdRecord = await EmployeeUserModel.create({
        employee_id: 123,
        user: userTwo,
      }).save();

      userTwo.employee_user = employeeIdRecord;
      await userTwo.save();

      return supertest()
        .patch(`/user/${userOne.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(userOne.id)}`])
        .send({ first_name: 'John', employee_id: 123 })
        .expect(HttpStatus.CONFLICT)
        .expect({
          message: 'Employee ID already exists',
        });
    });

    it('should return status 409 when student_id already exists', async () => {
      const userOne = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentIdRecord = await StudentUserModel.create({
        student_id: 123,
        user: userTwo,
      }).save();

      userTwo.student_user = studentIdRecord;
      await userTwo.save();

      return supertest()
        .patch(`/user/${userOne.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(userOne.id)}`])
        .send({ first_name: 'John', student_id: 123 })
        .expect(HttpStatus.CONFLICT)
        .expect({
          message: 'Student ID already exists',
        });
    });

    it('should return status 200 when user updated with employee_id', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .patch(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ first_name: 'Jane', employee_id: 1, student_id: 1 })
        .expect(HttpStatus.OK)
        .expect({
          message: 'ok',
        });
    });

    it('should return status 500 when an error occurs', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      // Relies on the fact that previous test case creates a student_id record
      return supertest()
        .patch(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ first_name: 'Jane', employee_id: 1, student_id: 1 })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /user/courses', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/user/courses').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 when there are no courses', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      const response = await supertest()
        .get('/user/courses')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('should return status 200 and courses', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
      }).save();

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      await CourseUserModel.create({
        course_role: CourseRoleEnum.STUDENT,
        user: user,
        course: course,
      }).save();

      const response = await supertest()
        .get('/user/courses')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchSnapshot();
    });

    it('should return status 400 when user is enrolled in the course, but course is archived', async () => {
      const course = await CourseModel.create({
        course_code: 'COSC 499',
        course_name: 'Capstone Project',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        section_name: '001',
        invite_code: '123',
        is_archived: true,
      }).save();

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const studentUser = await StudentUserModel.create({
        student_id: 123,
        user: user,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['student_user'],
      });

      user.student_user = studentUser;
      await user.save();

      await CourseUserModel.create({
        course_role: CourseRoleEnum.STUDENT,
        user: user,
        course: course,
      }).save();

      const response = await supertest()
        .get('/user/courses')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /user/password/request_reset', () => {
    it('should return status 400 when email is not provided', async () => {
      return supertest()
        .post('/user/password/request_reset')
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: ['Email is required', 'Email is invalid'],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 404 when user not found', async () => {
      return supertest()
        .post('/user/password/request_reset')
        .send({ email: 'invalid_email@mail.com' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });

    it('should return status 403 when email not verified', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return supertest()
        .post('/user/password/request_reset')
        .send({ email: user.email })
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          message: 'Email not verified',
        });
    });

    it('should return status 403 when invalid auth method', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        auth_type: AuthTypeEnum.GOOGLE_OAUTH,
      }).save();

      return supertest()
        .post('/user/password/request_reset')
        .send({ email: user.email })
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          message: 'User account has unsupported authentication type',
        });
    });

    it('should return status 200 when email sent', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      return supertest()
        .post('/user/password/request_reset')
        .send({ email: user.email })
        .expect(HttpStatus.OK)
        .expect({
          message: 'ok',
        });
    });
  });

  describe('POST /user/password/reset', () => {
    it('should return status 400 request body is invalid', async () => {
      return supertest()
        .post('/user/password/reset')
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: [
            'Token is required',
            'Token must be a string',
            'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
            'Password is required',
            'Password must be a string',
            'Confirmation password is required',
            'Confirmation password must be a string',
          ],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 400 when token not found', async () => {
      return supertest()
        .post('/user/password/reset')
        .send({
          token: 'invalid_token',
          password: 'p@ssworD2',
          confirm_password: 'p@ssworD2',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Invalid token',
        });
    });

    it('should return status 403 when token is expired', async () => {
      const token = await TokenModel.create({
        type: TokenTypeEnum.PASSWORD_RESET,
        created_at: 1_000_000_000,
        expires_at: 1_000_000_000,
      }).save();

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        tokens: [token],
      }).save();

      return supertest()
        .post('/user/password/reset')
        .send({
          token: token.token,
          password: 'p@ssworD2',
          confirm_password: 'p@ssworD2',
        })
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          message: 'Token has expired',
        });
    });

    it('should return status 200 when password reset', async () => {
      const token = await TokenModel.create({
        type: TokenTypeEnum.PASSWORD_RESET,
        created_at: 1_000_000_000,
        expires_at: parseInt(new Date().getTime().toString()) + 1_000_000,
      }).save();

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
        tokens: [token],
      }).save();

      const newPassword = 'p@ssworD2';

      supertest()
        .post('/user/password/reset')
        .send({
          token: token.token,
          password: newPassword,
          confirm_password: newPassword,
        })
        .expect(HttpStatus.OK)
        .expect({
          message: 'ok',
        });

      bcrypt.compare(newPassword, user.password, (err, result) => {
        if (result) {
          expect(result).toBe(true);
        }

        if (err) {
          expect(err).toBe(null);
        }
      });
    });
  });

  describe('GET /user/all', () => {
    it('should return status 401 if user not authenticated', () => {
      return supertest().get('/user/all').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .get('/user/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 200 if user is admin and query is empty', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      for (let i = 0; i < 10; i++) {
        await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john+${i}@mail.com`,
          email_verified: true,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();
      }

      return supertest()
        .get('/user/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should return 200 if user is admin and query provided only takes two users', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      const employeeUser = await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      user.employee_user = employeeUser;
      await user.save();

      for (let i = 0; i < 10; i++) {
        await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john+${i}@mail.com`,
          email_verified: true,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();
      }

      return supertest()
        .get('/user/all?take=2&page=1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });
  });

  describe('PATCH /user/:uid/change_role', () => {
    it('should return status 401 if user not authenticated', () => {
      return supertest()
        .patch('/user/1/change_role')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .patch('/user/1/change_role')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 if uid is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .patch('/user/abc/change_role')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 400 if userRole is not provided', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .patch('/user/1/change_role')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: ['User role is required', 'User role is invalid'],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 400 if userRole is invalid', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .patch('/user/1/change_role')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ userRole: 'INVALID_ROLE' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: ['User role is invalid'],
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 404 if user not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .patch('/user/100/change_role')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ userRole: UserRoleEnum.ADMIN })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });

    it('should return status 204 if user role is changed', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      const userToChange = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return supertest()
        .patch(`/user/${userToChange.id}/change_role`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ userRole: UserRoleEnum.ADMIN })
        .expect(HttpStatus.NO_CONTENT);
    });
  });

  describe('DELETE /user/:uid/delete_profile_picture', () => {
    it('should return status 401 if user not authenticated', () => {
      return supertest()
        .delete('/user/1/delete_profile_picture')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .delete('/user/1/delete_profile_picture')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 if uid is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .delete('/user/abc/delete_profile_picture')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
    });

    it('should return status 404 if user not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .delete('/user/100/delete_profile_picture')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });

    it('should return status 204 if profile picture is deleted', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
        avatar_url: 'profile_picture.jpg',
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      expect(user.avatar_url).toBe('profile_picture.jpg');

      await supertest()
        .delete(`/user/${user.id}/delete_profile_picture`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.NO_CONTENT);

      const updatedUser = await UserModel.findOne({ where: { id: user.id } });
      expect(updatedUser.avatar_url).toBe(null);
    });
  });

  describe('GET /user/all/count', () => {
    it('should return status 401 if user not authenticated', () => {
      return supertest().get('/user/all/count').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 if user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .get('/user/all/count')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 200 if user is admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      for (let i = 0; i < 10; i++) {
        await UserModel.create({
          first_name: 'John',
          last_name: 'Doe',
          email: `john.doe+${i}@mail.com`,
          email_verified: true,
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
        }).save();
      }

      return supertest()
        .get('/user/all/count')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toMatchSnapshot();
        });
    });

    it('should return 200 and only one role', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 123,
        user,
      }).save();

      return supertest()
        .get('/user/all/count')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toStrictEqual([
            {
              role: UserRoleEnum.ADMIN,
              count: '1',
            },
          ]);
        });
    });
  });
});
