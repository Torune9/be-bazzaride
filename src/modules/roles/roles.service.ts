import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll() {
    const roles = await this.prismaService.role.findMany();
    if (roles.length == 0) {
      throw new HttpException(
        {
          message: 'role masih kosong',
          statusCode: 400,
        },
        400,
      );
    }

    return {
      data: roles,
    };
  }

  async findOne(id: number) {
    const role = await this.prismaService.role.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });

    if (!role) {
      throw new NotFoundException({
        message: 'role tidak ditemukan',
        statusCode: 404,
      });
    }
    return {
      data: role,
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    if (updateRoleDto.name == undefined) {
      throw new HttpException(
        {
          message: 'nama belum terdefinsi',
          statusCode: 400,
        },
        400,
      );
    }
    const existing = await this.prismaService.role.findUnique({
      where: { id: id },
    });

    if (!existing) {
      throw new NotFoundException(`Role dengan id ${id} tidak ditemukan`);
    }

    const isSame =
      existing.name.toLowerCase() === updateRoleDto.name.toLowerCase();

    if (isSame) {
      return {
        message: 'tidak ada perubahan role',
      };
    }

    const updated = await this.prismaService.role.update({
      where: { id },
      data: { name: updateRoleDto.name },
    });

    return { data: updated };
  }

  async remove(id: number) {
    const isDeleteRole = await this.prismaService.role.delete({
      where: { id: id },
    });
    if (isDeleteRole) {
      return true;
    } else {
      return false;
    }
  }
}
