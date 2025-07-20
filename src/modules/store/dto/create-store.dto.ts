import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class CreateStoreDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
