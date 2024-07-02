import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
  // Importing UserModule with forwardRef as it has a circular dependency with TokenModule
  imports: [forwardRef(() => UserModule)],
})
export class TokenModule {}
