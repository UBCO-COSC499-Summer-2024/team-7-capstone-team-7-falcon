import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService, UserService],
  exports: [SemesterService],
})
export class SemesterModule {}
