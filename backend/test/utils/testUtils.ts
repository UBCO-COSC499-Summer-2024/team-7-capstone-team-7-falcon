import { INestApplication, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { config } from 'dotenv';
import * as path from 'path';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

config();

export const TestTypeOrmModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: 'test',
  entities: [path.join(__dirname, '../../src/**/*.entity.ts')],
  migrations: [path.join(__dirname, '../../migrations/*.ts')],
  synchronize: true,
  dropSchema: true,
});

export type ModuleModifier = (t: TestingModuleBuilder) => TestingModuleBuilder;

export const TestConfigModule = ConfigModule.forRoot({
  envFilePath: ['.env.test'],
  isGlobal: true,
});

export function setUpIntegrationTests(
  module: Type<any>,
  modifyModule?: ModuleModifier,
): () => supertest.SuperTest<supertest.Test> {
  let app: INestApplication;

  beforeAll(async () => {
    let testModuleBuilder = Test.createTestingModule({
      imports: [module, TestTypeOrmModule, TestConfigModule, AuthModule],
    });

    if (modifyModule) {
      testModuleBuilder = modifyModule(testModuleBuilder);
    }

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

export function signJwtToken(id: number): string {
  return new JwtService({
    secret: process.env.JWT_SECRET,
  }).sign({ id });
}
