import { INestApplication, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';

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
