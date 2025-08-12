/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsOptional()
  email: string;
  
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  roleId: number;
}
