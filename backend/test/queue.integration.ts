import { HttpStatus } from '@nestjs/common';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import QueueModule from '../src/modules/queue/queue.module';
import {
  BubbleSheetCompletionJobDto,
  BubbleSheetCreationJobDto,
} from '../src/modules/queue/dto/bubble-sheet-creation-job.dto';
import { BubbleSheetCreationService } from '../src/modules/queue/jobs/bubble-sheet-creation.service';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { UserRoleEnum } from '../src/enums/user.enum';
import Redis from 'ioredis';

describe('Queue Integration', () => {
  const supertest = setUpIntegrationTests(QueueModule);

  let redis: Redis;

  beforeAll(async () => {
    redis = new Redis();
  });

  afterAll(async () => {
    await redis.quit();
  });

  afterEach(async () => {
    await redis.flushall();
  });

  beforeEach(async () => {
    // Clear user table
    await UserModel.delete({});
    // Reset user id sequence (also known as auto increment)
    await UserModel.query('ALTER SEQUENCE user_model_id_seq RESTART WITH 1');
  });

  describe('POST /queue/:queue/add', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest()
        .post('/queue/bubble-sheet-creation/add')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should add a job to the queue and return status 202', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
      }).save();

      const response = await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      expect(response.status).toBe(HttpStatus.ACCEPTED);
      expect(response.body.jobId).toBeDefined();
    });
  });
});
