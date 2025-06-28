/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ data: object; token: string }> {
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

    const payload = {
      id: userData.id,
      userName: userData.username,
      email: loginUserDto.email,
    };
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
      data: payload,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async findAll() {
    const users = await this.prismaService.user.findMany();

    if (users.length === 0) {
      return {
        message: 'List user belum tersedia',
      };
    }
    return {
      data: users,
    };
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
