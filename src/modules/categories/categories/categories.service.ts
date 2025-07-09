import {
  BadGatewayException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { equal } from 'assert';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const isExists = await this.prismaService.category.findFirst({
      where: {
        name: {
          equals: data.name,
          mode: 'insensitive',
        },
      },
    });
    if (isExists) {
      throw new ConflictException({
        message: 'kategori sudah ada',
        statusCode: HttpStatus.CONFLICT,
      });
    }
    const category = await this.prismaService.category.create({
      data: {
        name: data.name,
      },
    });

    return category;
  }

  async getCategories() {
    const categories = await this.prismaService.category.findMany();

    return categories;
  }

  async getCategoriesById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new NotFoundException({
        message: 'data kategori tidak ditemukan',
        statusCode: 404,
      });
    }

    return category;
  }

  async updateCategory(id: string, name?: string) {
    const updateData: { name?: string } = {};

    if (name) {
      updateData.name = name;
    }

    const category = await this.prismaService.category.update({
      where: { id },
      data: updateData,
    });

    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.prismaService.category.delete({
      where: {
        id: id,
      },
    });

    if (!category) {
      throw new BadGatewayException({
        message: 'gagal menghapus kategori',
      });
    }

    return true;
  }
}
