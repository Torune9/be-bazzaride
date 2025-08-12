import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { imageUploadInterceptor } from 'src/common/interception-multer';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtCookieAuthGuard } from 'src/guard/jwt-cookie.guard';

@Controller('event')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @imageUploadInterceptor('poster')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const event = await this.eventsService.create(createEventDto, file);
    return {
      message: 'Event berhasil dibuat',
      data: event,
    };
  }

  @Get()
  async findAll(@Query('page') count: number) {
    const { data, total, page, totalPages } =
      await this.eventsService.findAll(count);

    return {
      message: 'data event berhasil di dapatkan',
      data,
      total,
      page,
      totalPages,
    };
  }
  @Get('latest')
  async findLatest() {
    const { event } = await this.eventsService.getLatest();
    return {
      message: 'berhasil mendapatkan event terbaru',
      data: event,
    };
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    return {
      message: `Data event ${id} berhasil di dapatkan!`,
      data: event,
    };
  }

  @UseGuards(JwtCookieAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @imageUploadInterceptor('poster')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const event = await this.eventsService.update(id, updateEventDto, file);

    return {
      message: 'Update event berhasil!',
      data: event,
    };
  }

  @UseGuards(JwtCookieAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.eventsService.remove(id);

    return {
      message: 'Event berhasil dihapus!',
    };
  }
}
