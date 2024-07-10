import { HttpStatus } from '@nestjs/common';
import { setUpIntegrationTests, signJwtToken } from './utils/testUtils';
import QueueModule from '../src/modules/queue/queue.module';
import {
  BubbleSheetCreationJobDto,
  BubbleSheetCompletionJobDto,
} from '../src/modules/queue/dto/bubble-sheet-creation-job.dto';
import { UserModel } from '../src/modules/user/entities/user.entity';
import { UserRoleEnum } from '../src/enums/user.enum';
import Redis from 'ioredis';
import * as sinon from 'sinon';
import { FileService } from '../src/modules/file/file.service';

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
          answers: [1, 2, 3, 4, 5],
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
        email_verified: true,
      }).save();

      const response = await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      expect(response.status).toBe(HttpStatus.ACCEPTED);
      expect(response.body.jobId).toBeDefined();
    });

    it('should return status 400 when the payload is invalid', async () => {
      const payload = {
        invalidPayload: 'invalid',
      };

      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      const response = await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /queue/:queue/pick', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest()
        .get('/queue/bubble-sheet-creation/pick')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 when the queue empty', async () => {
      supertest()
        .get('/queue/bubble-sheet-creation/pick')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return status 400 and the job when queue not found', async () => {
      supertest()
        .get('/queue/invalid-queue/pick')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return status 200 and the job when queue is found', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
          answers: [1, 2, 3, 4, 5],
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
        email_verified: true,
      }).save();

      await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      await supertest()
        .get('/queue/bubble-sheet-creation/pick')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.data.payload).toEqual(payload.payload);
        });
    });
  });

  describe('GET /queue/:queue/:jobId', () => {
    it('should return status 401 when no auth token is provided', () => {
      return supertest()
        .get('/queue/bubble-sheet-creation/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 when the job is not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      supertest()
        .get('/queue/bubble-sheet-creation/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return status 400 when the queue is not found', async () => {
      const user = await UserModel.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@test.com',
        password: 'password',
        created_at: 1_000_000_000,
        updated_at: 1_000_000_000,
        role: UserRoleEnum.PROFESSOR,
        email_verified: true,
      }).save();

      supertest()
        .get('/queue/invalid-queue/1')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return status 200 and the job when the job is found', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
          answers: [1, 2, 3, 4, 5],
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
        email_verified: true,
      }).save();

      const response = await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      await supertest()
        .get(`/queue/bubble-sheet-creation/${response.body.jobId}`)
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body.id).toBeDefined();
          expect(response.body.data.payload).toEqual(payload.payload);
        });
    });
  });

  describe('POST /queue/:queue/:jobId/complete', () => {
    it('should return status 401 when no token is provided', () => {
      return supertest()
        .patch('/queue/bubble-sheet-creation/1/complete')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 404 when the job is not found', async () => {
      supertest()
        .patch('/queue/bubble-sheet-creation/1/complete')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('should return status 400 when the queue is not found', async () => {
      supertest()
        .patch('/queue/invalid-queue/1/complete')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should complete the job and return status 200', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
          answers: [1, 2, 3, 4, 5],
        },
      };

      const completionPayload: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: '/path/to/file',
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
        email_verified: true,
      }).save();

      sinon.stub(FileService.prototype, 'zipFiles').returns(Promise.resolve());

      const response = await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      await supertest()
        .get('/queue/bubble-sheet-creation/pick')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.OK);

      await supertest()
        .patch(`/queue/bubble-sheet-creation/${response.body.jobId}/complete`)
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .send(completionPayload)
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toStrictEqual({ message: 'ok' });
        });

      sinon.restore();
    });

    it('should return status 400 when the job failed to complete due to missing bubble sheet files', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
          answers: [1, 2, 3, 4, 5],
        },
      };

      const completionPayload: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: '/path/to/file',
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
        email_verified: true,
      }).save();

      const response = await supertest()
        .post('/queue/bubble-sheet-creation/add')
        .set('Cookie', [`auth_token=${signJwtToken(user.id)}`])
        .send(payload);

      await supertest()
        .get('/queue/bubble-sheet-creation/pick')
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .expect(HttpStatus.OK);

      await supertest()
        .patch(`/queue/bubble-sheet-creation/${response.body.jobId}/complete`)
        .set('x-queue-auth-token', process.env.QUEUE_AUTH_TOKEN)
        .send(completionPayload)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
