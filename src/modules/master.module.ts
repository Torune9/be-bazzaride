import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, EventModule],
})
export class MasterModule {}
