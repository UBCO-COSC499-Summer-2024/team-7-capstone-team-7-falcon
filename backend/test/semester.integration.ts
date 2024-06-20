import { UserModel } from '../src/modules/user/entities/user.entity';
import { SemesterModel } from '../src/modules/semester/entities/semester.entity';
import { SemesterModule } from '../src/modules/semester/semester.module';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import { UserRoleEnum } from '../src/enums/user.enum';

describe('Semester Integration', () => {
  const supertest = setUpIntegrationTests(SemesterModule);

  beforeEach(async () => {
    await UserModel.delete({});
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');

    await SemesterModel.delete({});
    await SemesterModel.query(
      'ALTER SEQUENCE semester_model_id_seq RESTART WITH 1',
    );
  });

  describe('GET /semester/all', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().get('/semester/all').expect(401);
    });

    it('should return 404 if no semesters are found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await supertest()
        .get('/semester/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(404)
        .expect({
          message: 'Semesters not found',
        });
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

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await supertest()
        .get('/semester/all')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(200)
        .expect([
          {
            id: 1,
            name: 'Test Semester',
            starts_at: currentDate.toString(),
            ends_at: currentDate.toString(),
            created_at: currentDate.toString(),
            updated_at: currentDate.toString(),
          },
        ]);
    });
  });

  describe('POST /semester/create', () => {
    it('should return status 401 if no token is provided', async () => {
      await supertest().post('/semester/create').expect(401);
    });

    it('should return 401 if the user is not an admin', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await supertest()
        .post('/semester/create')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(401);
    });

    it('should return 400 if one of the required fields is missing', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

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
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

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
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.ADMIN,
      }).save();

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
});
