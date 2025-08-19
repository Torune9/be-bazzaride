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
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { imageUploadInterceptor } from 'src/common/interception-multer';
import { AuthGuard } from 'src/guard/auth.guard';
import { JwtCookieAuthGuard } from 'src/guard/jwt-cookie.guard';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @UseGuards(JwtCookieAuthGuard)
  @Post()
  @imageUploadInterceptor('image')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createStoreDto: CreateStoreDto,
  ) {
    const newStore = await this.storeService.create(createStoreDto, file);

    return {
      data: newStore,
      message: 'Store berhasil dibuat',
    };
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

  @UseGuards(JwtCookieAuthGuard)
  @Patch(':id')
  @imageUploadInterceptor('image')
  async update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateStore = await this.storeService.update(
      id,
      updateStoreDto,
      file,
    );

    return {
      data: updateStore,
      message: 'Update store berhasil',
    };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.storeService.remove(id);

    return {
      message: 'Store berhasil dihapus',
    };
  }
}
