/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUsersAddressDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  district: string;
}
