import { HttpStatus } from '@nestjs/common';
import { HealthModule } from '../src/health/health.module';
import { setUpIntegrationTests } from './utils/testUtils';

describe('HealthController Integration', () => {
  const supertest = setUpIntegrationTests(HealthModule);

  describe('GET /health', () => {
    it('should return status 200', async () => {
      const response = await supertest().get('/health');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({ message: 'ok' });
    });
  });
});
