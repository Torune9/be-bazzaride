import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { EventsService } from './events.service';
import { CloudinaryModule } from 'src/libs/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [EventsController],
  providers: [EventsService, CloudinaryService],
  exports: [CloudinaryService],
})
export class EventModule {}
