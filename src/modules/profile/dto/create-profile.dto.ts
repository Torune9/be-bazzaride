/* eslint-disable prettier/prettier */
import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProfileDto {
  @IsEmpty()
  @IsString()
  firstName: string;

  @IsEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
