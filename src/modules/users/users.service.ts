/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  @Inject() private prismaService: PrismaService;

  async register(createUserDto: CreateUserDto) {
    const userExist = await this.prismaService.user.findFirst({
      where: {
        email: {
          equals: createUserDto.email,
        },
      },
    });
    if (userExist) {
      throw new ConflictException();
    }
    const data = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        role: { connect: { id: createUserDto.roleId } },
      },
    });

    return {
      data: data,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
