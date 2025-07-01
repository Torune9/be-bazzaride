import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUsersAddressDto } from './create-users-address.dto';

export class UpdateUsersAddressDto extends PartialType(
  PickType(CreateUsersAddressDto, ['city', 'district'] as const),
) {}
