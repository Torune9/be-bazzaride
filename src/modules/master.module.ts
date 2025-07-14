import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ProfileModule } from './profile/profile.module';
import { UsersAddressesModule } from './users-addresses/users-addresses.module';
import { CategoriesModule } from './categories/categories/categories.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [
    EventModule,
    UsersModule,
    RolesModule,
    ProfileModule,
    UsersAddressesModule,
    CategoriesModule,
    StoreModule,
  ],
})
export class MasterModule {}
