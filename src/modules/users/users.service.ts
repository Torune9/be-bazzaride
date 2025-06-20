/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { dataLogin } from 'src/model/userLogin.model.';
import { LoginUserDto } from './dto/login.dto';
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

  async login(loginUserDto: LoginUserDto): Promise<Record<'data', dataLogin>> {
    const userData = await this.prismaService.user.findFirst({
      where: {
        email: {
          equals: loginUserDto.email,
        },
      },
    });
    if (!userData) {
      throw new HttpException(
        {
          message: 'email tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
        },
        404,
      );
    }
    const truePassword = await bcrypt.compare(
      loginUserDto.password,
      userData.password,
    );
    if (!truePassword) {
      throw new HttpException(
        {
          message: 'password salah',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        400,
      );
    }
    return {
      data: userData,
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        message: 'user not found',
      });
    }

    return {
      data: user,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
