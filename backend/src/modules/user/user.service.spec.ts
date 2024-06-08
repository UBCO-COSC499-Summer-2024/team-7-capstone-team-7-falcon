import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { UserModel } from './entities/user.entity';
import { EmployeeUserModel } from './entities/employee-user.entity';
import { StudentUserModel } from './entities/student-user.entity';
import { AuthTypeEnum } from '../../enums/user.enum';
import { OAuthGoogleUserPayload } from '../../common/interfaces';

describe('UserService', () => {
  let userService: UserService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [UserService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('getUserById', () => {
    it('should return user', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 1,
        user: user,
      }).save();

      await StudentUserModel.create({
        student_id: 1,
        user: user,
      }).save();

      const result = await userService.getUserById(user.id);
      expect(result).toMatchSnapshot();
    });

    it("should return null when user id doesn't exist", async () => {
      const user = await userService.getUserById(100);
      expect(user).toBeNull();
    });
  });

  describe('findOrCreateUser', () => {
    it('should create user', async () => {
      const userPayload: OAuthGoogleUserPayload = {
        email: 'john.doe@test.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'picture',
      };

      const user = await userService.findOrCreateUser(
        userPayload,
        AuthTypeEnum.GOOGLE_OAUTH,
      );

      delete user.created_at;
      delete user.updated_at;

      expect(user).toMatchSnapshot();
    });

    it('should throw an error when user already exists with different auth type', async () => {
      const userPayload: OAuthGoogleUserPayload = {
        email: 'john.doe@test.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'picture',
      };

      await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        userService.findOrCreateUser(userPayload, AuthTypeEnum.GOOGLE_OAUTH),
      ).rejects.toThrow('User already exists');
    });

    it('should throw an error when auth type is not supported', async () => {
      const userPayload: OAuthGoogleUserPayload = {
        email: 'john.doe@test.com',
        given_name: 'John',
        family_name: 'Doe',
        picture: 'picture',
      };

      await expect(
        userService.findOrCreateUser(userPayload, AuthTypeEnum.EMAIL),
      ).rejects.toThrow('Invalid auth method');
    });
  });
});
