import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [],
})
export class SeedModule {}
