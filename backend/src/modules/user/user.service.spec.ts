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
import { faker } from '@faker-js/faker';

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

  describe('editUser', () => {
    it('should throw an error when user is not found', async () => {
      await expect(
        userService.editUser(100, {
          first_name: faker.person.firstName(),
        }),
      ).rejects.toThrow('User not found');
    });

    it('should edit user first name', async () => {
      const oldFirstName = faker.person.firstName();

      await UserModel.create({
        first_name: oldFirstName,
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const newFirstName = faker.person.firstName();

      const user = await userService.editUser(1, {
        first_name: newFirstName,
      });

      expect(user.first_name).toBe(newFirstName);
    });

    it('should edit user last name', async () => {
      const oldLastName = faker.person.lastName();
      const firstName = faker.person.firstName();

      await UserModel.create({
        first_name: firstName,
        last_name: oldLastName,
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const newLastName = faker.person.lastName();

      const user = await userService.editUser(1, {
        first_name: firstName,
        last_name: newLastName,
      });

      expect(user.last_name).toBe(newLastName);
    });

    it('should throw an error when employee id already exists', async () => {
      const firstUser = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await EmployeeUserModel.create({
        employee_id: 1,
        user: firstUser,
      }).save();

      await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        userService.editUser(2, {
          first_name: faker.person.firstName(),
          employee_id: 1,
        }),
      ).rejects.toThrow('Employee ID already exists');
    });

    it('should create employee id', async () => {
      const user = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await userService.editUser(user.id, {
        first_name: faker.person.firstName(),
        employee_id: 1,
      });

      const employeeUser = await EmployeeUserModel.findOne({
        where: { id: 1 },
        relations: ['user'],
      });

      expect(employeeUser).toBeDefined();
      expect(employeeUser.user.id).toBe(user.id);
    });

    it('should update employee id', async () => {
      const user = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const oldEmployeeId = 1;
      const newEmployeeId = 2;

      const employeeUserRecord = await EmployeeUserModel.create({
        employee_id: oldEmployeeId,
        user: user,
      }).save();

      await userService.editUser(user.id, {
        first_name: faker.person.firstName(),
        employee_id: newEmployeeId,
      });

      const employeeUser = await EmployeeUserModel.findOne({
        where: { id: employeeUserRecord.id, employee_id: oldEmployeeId },
      });

      expect(employeeUser).toBeNull();

      const updatedEmployeeUser = await EmployeeUserModel.findOne({
        where: { id: employeeUserRecord.id, employee_id: newEmployeeId },
        relations: ['user'],
      });

      expect(updatedEmployeeUser).toBeDefined();
      expect(updatedEmployeeUser.user.id).toBe(user.id);
    });

    it('should throw an error when student id already exists', async () => {
      const firstUser = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const studentId = 1;

      await StudentUserModel.create({
        student_id: studentId,
        user: firstUser,
      }).save();

      const newUser = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await expect(
        userService.editUser(newUser.id, {
          first_name: faker.person.firstName(),
          student_id: studentId,
        }),
      ).rejects.toThrow('Student ID already exists');
    });

    it('should create student id', async () => {
      const user = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      await userService.editUser(user.id, {
        first_name: faker.person.firstName(),
        student_id: 1,
      });

      const studentUser = await StudentUserModel.findOne({
        where: { student_id: 1 },
        relations: ['user'],
      });

      expect(studentUser).toBeDefined();
      expect(studentUser.user.id).toBe(user.id);
    });

    it('should update student id', async () => {
      const user = await UserModel.create({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
      }).save();

      const oldStudentId = 1;
      const newStudentId = 2;

      await StudentUserModel.create({
        student_id: oldStudentId,
        user: user,
      }).save();

      await userService.editUser(user.id, {
        first_name: faker.person.firstName(),
        student_id: newStudentId,
      });

      const updatedStudentUser = await StudentUserModel.findOne({
        where: { student_id: newStudentId },
        relations: ['user'],
      });

      expect(updatedStudentUser).toBeDefined();
      expect(updatedStudentUser.user.id).toBe(user.id);
    });
  });
});
