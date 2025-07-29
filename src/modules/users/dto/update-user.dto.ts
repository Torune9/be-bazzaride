/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  email: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  roleId: number;
}
