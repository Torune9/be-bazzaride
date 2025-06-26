import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { imageUploadInterceptor } from 'src/common/interception-multer';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @imageUploadInterceptor('image')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profile = await this.profileService.create(createProfileDto, file);

    return {
      data: profile,
      message: 'Profile berhasil dibuat',
    };
  }

  @Get()
  async findAll() {
    const profile = await this.profileService.findAll();

    return {
      data: profile,
      message: 'Profile berhasil ditemukan',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const profile = await this.profileService.findOne(id);

    return {
      data: profile,
      message: 'Profile ditemukan!',
    };
  }

  @Patch(':id')
  @imageUploadInterceptor('image')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profile = await this.profileService.update(
      id,
      updateProfileDto,
      file,
    );
    return {
      data: profile,
      message: 'Berhasil update profile',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.profileService.remove(id);

    return {
      message: 'Profile berhasil dihapus',
    };
  }
}
