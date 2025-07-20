/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';
import { getPublicIdFromUrl } from 'src/helper/get-public-id';

@Injectable()
export class EventsService {
  constructor(
    private prismaService: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(createEventDto: CreateEventDto, file: Express.Multer.File) {
    const { userId, ...restData } = createEventDto;

    if (!file) {
      throw new BadRequestException('Poster tidak boleh kosong');
    }

    const posterUrl = await this.cloudinary.uploadImage(file);
    const createEvent = await this.prismaService.event.create({
      data: {
        ...restData,
        poster: posterUrl,
        user: { connect: { id: userId } },
      },
    });

    return createEvent;
  }

  async findAll() {
    const event = await this.prismaService.event.findMany({
      include: { user: true, category: true },
    });

    return event;
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
      include: { user: true, category: true },
    });

    if (!event) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    return event;
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.prismaService.event.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException();
    }

    const dataToUpdate: Partial<UpdateEventDto> & { poster?: string } = {
      ...updateEventDto,
    };

    if (file) {
      const newPoster = await this.cloudinary.uploadImage(file);

      if (existing.poster) {
        const publicId = getPublicIdFromUrl(existing.poster);
        await this.cloudinary.deleteImage(publicId);
      }

      dataToUpdate.poster = newPoster;
    }

    const updated = await this.prismaService.event.update({
      where: { id },
      data: dataToUpdate,
    });

    return updated;
  }

  async remove(id: string) {
    try {
      const deleted = await this.prismaService.event.delete({
        where: { id },
      });

      return deleted;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Event dengan id tersebut tidak ditemukan',
          );
        }
      }
      throw new BadRequestException('Gagal delete event');
    }
  }
}
