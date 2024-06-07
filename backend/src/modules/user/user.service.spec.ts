import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {
  TestConfigModule,
  TestTypeOrmModule,
} from '../../../test/utils/testUtils';
import { UserModel } from './entities/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [UserService],
      imports: [TestTypeOrmModule, TestConfigModule],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  afterAll(async () => {
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

      const result = await userService.getUserById(user.id);
      expect(result).toMatchSnapshot();
    });

    it('should return null', async () => {
      const user = await userService.getUserById(100);
      expect(user).toBeNull();
    });
  });
});
