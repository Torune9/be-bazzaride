import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(createProfileDto: CreateProfileDto, file: Express.Multer.File) {
    const { userId, firstName, lastName, image } = createProfileDto;

    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.cloudinary.uploadImage(file);
    }

    const profile = await this.prisma.profile.create({
      data: {
        firstName,
        lastName,
        image: imageUrl,
        user: {
          connect: { id: userId },
        },
      },
    });

    return profile;
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
