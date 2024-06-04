import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as bodyparser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.use(morgan('dev'));
  app.use(bodyparser.json({ limit: '150mb' }));
  app.use(bodyparser.urlencoded({ limit: '150mb', extended: true }));

  await app.listen(3001);
}
bootstrap();
