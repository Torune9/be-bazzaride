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
      throw new ConflictException({
        messaage: 'email sudah terdaftar',
        statusCode: HttpStatus.CONFLICT,
      });
    }
    const data = await this.prismaService.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });

    return {
      data: data,
    };
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ data: object; token: string; roleId: number }> {
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

    const payload = {
      id: userData.id,
      username: userData.username,
      email: loginUserDto.email,
    };

    if (userData.password) {
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
    }
    return {
      data: payload,
      token: await this.jwtService.signAsync(payload),
      roleId: userData.roleId as number,
    };
  }

  async me(id: string) {
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

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return {
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

  async update(id: string, userUpdateDto: UpdateUserDto) {
    const oldUser = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!oldUser) {
      throw new Error('User tidak ditemukan');
    }

    const updatedData = {
      email: userUpdateDto.email?.trim() || oldUser.email,
      username: userUpdateDto.username?.trim() || oldUser.username,
      roleId: userUpdateDto.roleId || oldUser.roleId,
    };

    const isSame =
      updatedData.email === oldUser.email &&
      updatedData.username === oldUser.username &&
      updatedData.roleId === oldUser.roleId;

    if (isSame) {
      return { message: 'Tidak ada perubahan pada data user' };
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updatedData,
    });

    return {
      message: 'User berhasil diupdate',
      data: updatedUser,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
