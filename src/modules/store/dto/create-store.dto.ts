import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateStoreDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
