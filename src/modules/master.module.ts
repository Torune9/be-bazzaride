import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ProfileModule } from './profile/profile.module';
import { UsersAddressesModule } from './users-addresses/users-addresses.module';

@Module({
  imports: [
    EventModule,
    UsersModule,
    RolesModule,
    ProfileModule,
    UsersAddressesModule,
  ],
})
export class MasterModule {}
