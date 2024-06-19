import { HttpStatus } from '@nestjs/common';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { CourseRoleEnum, UserRoleEnum } from '../src/enums/user.enum';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';
import { StudentUserModel } from '../src/modules/user/entities/student-user.entity';
import { CourseModel } from '../src/modules/course/entities/course.entity';
import { CourseUserModel } from '../src/modules/course/entities/course-user.entity';

describe('User Integration', () => {
  const supertest = setUpIntegrationTests(UserModule);

  beforeEach(async () => {
    await CourseUserModel.delete({});
    await CourseModel.delete({});
    await UserModel.delete({});

    await CourseModel.query(
      'ALTER SEQUENCE course_model_id_seq RESTART WITH 1',
    );
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
    await CourseUserModel.query(
      'ALTER SEQUENCE course_user_model_id_seq RESTART WITH 1',
    );
  });

  describe('GET /', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/user').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 200 and user object', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const response = await supertest()
        .get('/user')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });

  describe('GET /:uid', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/user/1').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 401 when user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      return supertest()
        .get('/user/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 when uid is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

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
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const response = await supertest()
        .get(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(1)}`]);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchSnapshot();
    });

    it("should return status 404 when user id doesn't exist", async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      return supertest()
        .get('/user/100')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          message: 'User not found',
        });
    });
  });

  describe('PATCH /:uid', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().patch('/user/1').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 400 when uid is not a number', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

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
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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
        role: UserRoleEnum.ADMIN,
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

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
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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
      }).save();

      const userTwo = await UserModel.create({
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
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
      }).save();

      // Relies on the fact that previous test case creates a student_id record
      return supertest()
        .patch(`/user/${user.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({ first_name: 'Jane', employee_id: 1, student_id: 1 })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /courses', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest().get('/user/courses').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 when there are no courses', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

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

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

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

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

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
});
