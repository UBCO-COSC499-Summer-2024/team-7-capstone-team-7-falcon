import { UserModel } from '../src/modules/user/entities/user.entity';
import { SemesterModel } from '../src/modules/semester/entities/semester.entity';
import { SemesterModule } from '../src/modules/semester/semester.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { UserRoleEnum } from '../src/enums/user.enum';
import { EmployeeUserModel } from '../src/modules/user/entities/employee-user.entity';
import { CourseModel } from '../src/modules/course/entities/course.entity';

describe('Semester Integration', () => {
  const supertest = setUpIntegrationTests(SemesterModule);

  beforeEach(async () => {
    await UserModel.delete({});
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');

    await EmployeeUserModel.delete({});
    await EmployeeUserModel.query(
      'ALTER SEQUENCE employee_user_model_id_seq RESTART WITH 1',
    );

    await CourseModel.delete({});
    await CourseModel.query(
      'ALTER SEQUENCE course_model_id_seq RESTART WITH 1',
    );

    await SemesterModel.delete({});
    await SemesterModel.query(
      'ALTER SEQUENCE semester_model_id_seq RESTART WITH 1',
    );
  });

  describe('GET /semester/limited/all', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().get('/semester/limited/all').expect(401);
    });

    it('should return 403 if the user did not provide employee or student ID', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await supertest()
        .get('/semester/limited/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(403)
        .expect({
          message: 'Student or Employee ID is missing',
          errorCode: 'STUDENT_OR_EMPLOYEE_ID_NOT_PRESENT',
        });
    });

    it('should return 204 if no semesters are found', async () => {
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

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(204);
    });

    it('should return 200 if semesters are found', async () => {
      const currentDate = parseInt(new Date().getTime().toString());

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

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

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/limited/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(200)
        .expect([
          {
            id: 1,
            name: 'Test Semester',
          },
        ]);
    });
  });

  describe('POST /semester/create', () => {
    it('should return status 401 if user not authenticated', async () => {
      await supertest().post('/semester/create').expect(401);
    });

    it('should return 403 if the user did not provide employee or student ID', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      await supertest()
        .post('/semester/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(403)
        .expect({
          message: 'Student or Employee ID is missing',
          errorCode: 'STUDENT_OR_EMPLOYEE_ID_NOT_PRESENT',
        });
    });

    it('should return 403 if the user is not an admin', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        email_verified: true,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .post('/semester/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if one of the required fields is missing', async () => {
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

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .post('/semester/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: parseInt(new Date().getTime().toString()),
        })
        .expect(400)
        .expect({
          message: [
            'End date is required',
            'ends_at must be a number conforming to the specified constraints',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 400 if the start date is after the end date', async () => {
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

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .post('/semester/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: parseInt(new Date().getTime().toString()),
          ends_at: parseInt(new Date().getTime().toString()) - 1000,
        })
        .expect(400)
        .expect({
          message: 'Start date must be before end date',
        });
    });

    it('should return 201 if the semester is created successfully', async () => {
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

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .post('/semester/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: parseInt(new Date().getTime().toString()),
          ends_at: parseInt(new Date().getTime().toString()) + 1000,
        })
        .expect(201)
        .expect({
          message: 'ok',
        });
    });
  });

  describe('PATCH /semester/:sid', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().patch('/semester/1').expect(401);
    });

    it('should return 401 if the user is not an admin', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .patch('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if semester id is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .patch('/semester/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 400 if one of the required fields is missing', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .patch('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: parseInt(new Date().getTime().toString()),
        })
        .expect(400)
        .expect({
          message: [
            'End date is required',
            'ends_at must be a number conforming to the specified constraints',
          ],
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 404 if the semester does not exist', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .patch('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: parseInt(new Date().getTime().toString()),
          ends_at: parseInt(new Date().getTime().toString()) + 1000,
        })
        .expect(404)
        .expect({
          message: 'Semester not found',
        });
    });

    it('should return 400 if the start date is after the end date', async () => {
      const currentDate = parseInt(new Date().getTime().toString());

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .patch('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: currentDate,
          ends_at: currentDate - 1000,
        })
        .expect(400)
        .expect({
          message: 'Start date must be before end date',
        });
    });

    it('should return 204 if the semester is updated successfully', async () => {
      const currentDate = parseInt(new Date().getTime().toString());

      await SemesterModel.create({
        name: 'Test Semester',
        created_at: currentDate,
        updated_at: currentDate,
        starts_at: currentDate,
        ends_at: currentDate,
      }).save();

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .patch('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send({
          name: 'Semester 1',
          starts_at: currentDate,
          ends_at: currentDate + 1_0000,
        })
        .expect(204);
    });
  });

  describe('GET /semester/:sid', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().get('/semester/1').expect(401);
    });

    it('should return 401 if the user is not an admin', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if semester id is not a number', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 404 if the semester does not exist', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404)
        .expect({
          message: 'Semester not found',
        });
    });

    it('should return 200 if the semester is found', async () => {
      const semester = await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000,
        updated_at: 1_000_000,
        starts_at: 1_000_000,
        ends_at: 1_000_000,
      }).save();

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      const result = await supertest()
        .get(`/semester/${semester.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`]);

      expect(result.status).toBe(200);
      expect(result.body).toMatchSnapshot();
    });
  });

  describe('GET /semester/all', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().get('/semester/all').expect(401);
    });

    it('should return 401 if the user is not an admin', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 200 if semesters are found', async () => {
      let semester = await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        starts_at: 1_000_000_000,
        ends_at: 1_000_000_000,
      }).save();

      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      semester = await SemesterModel.findOne({
        where: { id: semester.id },
        relations: ['courses'],
      });

      for (let i = 0; i < 10; i++) {
        const course = await CourseModel.create({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          section_name: '001',
          invite_code: '123',
          semester: semester,
        }).save();

        semester.courses.push(course);
      }
      await semester.save();

      await supertest()
        .get('/semester/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchSnapshot();
        });
    });

    it('should return 204 if no semesters are found', async () => {
      let user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

      const employeeUser = await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      user = await UserModel.findOne({
        where: { id: user.id },
        relations: ['employee_user'],
      });

      user.employee_user = employeeUser;
      await user.save();

      await supertest()
        .get('/semester/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(204);
    });
  });

  describe('DELETE /semester/:sid', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().delete('/semester/1').expect(401);
    });

    it('should return 401 if the user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@mail.com',
        email_verified: true,
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        user: user,
        employee_id: 1,
      }).save();

      await supertest()
        .delete('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if semester id is not a number', async () => {
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
        user: user,
        employee_id: 1,
      }).save();

      await supertest()
        .delete('/semester/abc')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(400)
        .expect({
          message: 'Validation failed (numeric string is expected)',
          error: 'Bad Request',
          statusCode: 400,
        });
    });

    it('should return 404 if the semester does not exist', async () => {
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
        user: user,
        employee_id: 1,
      }).save();

      await supertest()
        .delete('/semester/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404)
        .expect({
          message: 'Semester not found',
        });
    });

    it('should return 204 if the semester is deleted successfully', async () => {
      const semester = await SemesterModel.create({
        name: 'Test Semester',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        starts_at: 1_000_000_000,
        ends_at: 1_000_000_000,
      }).save();

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
        user: user,
        employee_id: 1,
      }).save();

      for (let i = 0; i < 10; i++) {
        await CourseModel.create({
          course_code: 'COSC 499',
          course_name: 'Capstone Project',
          created_at: 1_000_000_000,
          updated_at: 1_000_000_000,
          section_name: '001',
          invite_code: '123',
          semester: semester,
        }).save();
      }

      await supertest()
        .delete(`/semester/${semester.id}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(204);

      const result = await SemesterModel.findOne({
        where: { id: semester.id },
      });

      expect(result).toBeNull();

      const courses = await CourseModel.find({
        relations: ['semester'],
      });

      expect(courses).toHaveLength(10);

      courses.forEach((course) => {
        expect(course.semester).toBeNull();
      });
    });
  });
});
