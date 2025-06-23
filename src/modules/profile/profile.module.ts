import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CloudinaryModule } from 'src/libs/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService],
  exports: [CloudinaryService],
})
export class ProfileModule {}
