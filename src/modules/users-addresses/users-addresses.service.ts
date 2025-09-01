import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsersAddressDto } from './dto/create-users-address.dto';
import { UpdateUsersAddressDto } from './dto/update-users-address.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersAddressesService {
  constructor(private prismaService: PrismaService) {}
  async create(createUsersAddressDto: CreateUsersAddressDto) {
    const createAddress = await this.prismaService.userAddress.create({
      data: createUsersAddressDto,
    });

    if (!createAddress) {
      throw new BadRequestException({
        message: 'alamat gagal di buat',
      });
    }

    return {
      data: createAddress,
    };
  }

  findAll() {
    return `This action returns all usersAddresses`;
  }

  async findOne(id: string) {
    const addresses = await this.prismaService.userAddress.findFirst({
      where: {
        userId: {
          equals: id,
        },
      },
    });

    if (!addresses) {
      throw new NotFoundException({
        message: 'alamat tidak ditemukan',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return {
      data: addresses,
    };
  }

  async update(id: string, updateUsersAddressDto: UpdateUsersAddressDto) {
    try {
      const updateAddress = await this.prismaService.userAddress.update({
        where: {
          id: id,
        },
        data: {
          city: updateUsersAddressDto.city,
          district: updateUsersAddressDto.district,
        },
      });
      return {
        data: updateAddress,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: 'eror ketika update',
          errors: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  async remove(id: string) {
    const removeAddress = await this.prismaService.userAddress.delete({
      where: {
        id: id,
      },
    });

    if (!removeAddress) {
      throw new NotFoundException({
        message: 'alamat tidak ditemukan',
      });
    }
    return {
      message: 'alamat berhasil dihapus',
    };
  }
}
