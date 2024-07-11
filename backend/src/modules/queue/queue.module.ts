import { Module } from '@nestjs/common';
import { BubbleSheetCreationService } from './jobs/bubble-sheet-creation.service';
import { BullModule } from '@nestjs/bull';
import { QueueController } from './queue.controller';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { FileService } from '../file/file.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'bubble-sheet-creation',
    }),
  ],
  controllers: [QueueController],
  providers: [
    BubbleSheetCreationService,
    UserService,
    TokenService,
    MailService,
    FileService,
  ],
})
export default class QueueModule {}
