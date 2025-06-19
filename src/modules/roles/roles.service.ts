import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}
  async create(createRoleDto: CreateRoleDto) {
    const roleExist = await this.prismaService.role.findFirst({
      where: {
        name: {
          equals: createRoleDto.name,
          mode: 'insensitive',
        },
      },
    });

    if (roleExist) {
      throw new HttpException(
        {
          code: HttpStatus.CONFLICT,
          message: 'role sudah ada',
        },
        HttpStatus.CONFLICT,
      );
    }

    return await this.prismaService.role.create({
      data: {
        name: createRoleDto.name,
      },
    });
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
