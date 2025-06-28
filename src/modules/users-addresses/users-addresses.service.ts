import {
  BadRequestException,
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
    const addresses = await this.prismaService.userAddress.findMany({
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

  update(id: number, updateUsersAddressDto: UpdateUsersAddressDto) {
    return `This action updates a #${id} usersAddress`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersAddress`;
  }
}
