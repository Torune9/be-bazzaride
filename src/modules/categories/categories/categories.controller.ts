import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  async create(@Body() payload: CreateCategoryDto) {
    const category = await this.categoryService.createCategory(payload);
    return {
      message: 'kategori berhasil dibuat',
      data: category,
    };
  }
  @Get()
  async get() {
    const categories = await this.categoryService.getCategories();
    return {
      message: 'kategori berhasil didapatkan',
      data: categories,
    };
  }
  @Get(':id')
  async getById(@Param('id') id: string) {
    const category = await this.categoryService.getCategoriesById(id);

    return {
      message: 'detail kategori berhasil didapatkan',
      data: category,
    };
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: { name?: string }) {
    if (!body.name) {
      return {
        message: 'tidak ada perubahan pada kategori',
      };
    }
    const category = await this.categoryService.updateCategory(id, body.name);
    return {
      message: 'kategori berhasil diubah',
      data: category,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const isDelete = await this.categoryService.deleteCategory(id);
    if (isDelete) {
      return {
        message: 'kategori berhasil dihapus',
      };
    }
  }
}
