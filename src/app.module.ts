import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MasterModule } from './modules/master.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ProfileModule } from './profile/profile.module';
import { UsersAddressesModule } from './users-addresses/users-addresses.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, MasterModule, UsersModule, RolesModule, ProfileModule, UsersAddressesModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
