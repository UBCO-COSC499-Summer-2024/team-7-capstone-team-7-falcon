import { UserModel } from '../src/modules/user/entities/user.entity';
import { UserModule } from '../src/modules/user/user.module';
import { setUpIntegrationTests } from './utils/testUtils';

describe('User Integration', () => {
  const supertest = setUpIntegrationTests(UserModule);

  describe('GET /', () => {
    it('should return status 200 and OK message', () => {
      return supertest().get('/user').expect(200).expect({ message: 'ok' });
    });
  });

  describe('GET /:uid', () => {
    it('should return status 400 when uid is not a number', () => {
      return supertest().get('/user/abc').expect(400).expect({
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
        statusCode: 400,
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
      }).save();

      const response = await supertest().get(`/user/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });

    it("should return status 404 when user id doesn't exist", () => {
      return supertest().get('/user/100').expect(404).expect({
        message: 'User not found',
      });
    });
  });
});
