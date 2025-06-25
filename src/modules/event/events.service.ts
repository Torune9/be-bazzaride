/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}
  create(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
  }

  async findAll() {
    const event = await this.prismaService.event.findMany();
    if (event.length === 0) {
      throw new HttpException(
        {
          message: 'Event masih kosong',
          statusCode: '404',
        },
        400,
      );
    }

    return event;
  }

  async findOne(id: string) {
    const event = await this.prismaService.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException({
        message: 'Event tidak ditemukan',
        statusCode: '404',
      });
    }

    return event;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  async remove(id: string) {
    const event = await this.prismaService.event.delete({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException({
        message: 'Event tidak ditemukan',
        statusCode: '404',
      });
    }
    return event;
  }
}
