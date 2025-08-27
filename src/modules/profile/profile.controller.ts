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
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { imageUploadInterceptor } from 'src/common/interception-multer';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtCookieAuthGuard } from 'src/guard/jwt-cookie.guard';

@UseGuards(JwtCookieAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @imageUploadInterceptor('image')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: Request,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req['user'].id;
    const profile = await this.profileService.create(
      createProfileDto,
      file,
      userId,
    );

    return {
      data: profile,
      message: 'Profile berhasil dibuat',
    };
  }

  @Get('/me')
  async getMe(@Req() req: Request) {
    const userId = req['user'].id;
    console.log('userId ->', userId);
    const profile = await this.profileService.getProfile(userId);

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

  @Put('/update')
  @imageUploadInterceptor('image')
  async update(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req['user'].id;
    const profile = await this.profileService.update(
      userId,
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
