import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { CloudinaryModule } from 'src/libs/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [StoreController],
  providers: [StoreService, CloudinaryService],
  exports: [CloudinaryService],
})
export class StoreModule {}
