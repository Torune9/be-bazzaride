/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoreService {
  constructor(private prismaService: PrismaService) {}
  create(createStoreDto: CreateStoreDto) {
    return `This action adds a new store`;
  }

  async findAll() {
    const stores = await this.prismaService.store.findMany({
      include: {
        user: true,
      },
    });

    return stores;
  }

  async findOne(id: string) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id,
      },
    });

    if (!store) {
      throw new Error('Store not found');
    }
    return store;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  async remove(id: string) {
    const store = await this.prismaService.store.delete({
      where: {
        id,
      },
    });

    if (!store) {
      throw new Error('Store not found');
    }
    return store;
  }
}
