import { INestApplication, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { config } from 'dotenv';

config();

export const TestTypeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: 'test',
  entities: ['./**/*.entity.ts'],
  synchronize: true,
  dropSchema: true,
});

export const TestConfigModule = ConfigModule.forRoot({
  envFilePath: ['.env'],
  isGlobal: true,
});

export function setUpIntegrationTests(
  module: Type<any>,
): () => supertest.SuperTest<supertest.Test> {
  let app: INestApplication;

  beforeAll(async () => {
    const testModuleBuilder = Test.createTestingModule({
      imports: [module],
    });

    const testModule = await testModuleBuilder.compile();

    app = testModule.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  return () => {
    return supertest.agent(
      app.getHttpServer(),
    ) as unknown as supertest.SuperTest<supertest.Test>;
  };
}
