import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  async findAll() {
    const stores = await this.storeService.findAll();

    return {
      message: 'Data store berhasil di dapatkan',
      data: stores,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const store = await this.storeService.findOne(id);

    return {
      message: 'Data store berhasil di dapatkan',
      data: store,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storeService.remove(id);

    return {
      message: 'Store berhasil dihapus',
    };
  }
}
