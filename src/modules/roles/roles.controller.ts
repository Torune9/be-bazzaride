import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { paramBadRequest } from 'src/common/filters/paramBadRequest.filter';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('role')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.create(createRoleDto);
    return {
      message: 'role berhasil dibuat',
      code: HttpStatus.CREATED,
      data: role,
    };
  }

  @Get()
  async findAll() {
    const { data } = await this.rolesService.findAll();
    return {
      message: 'data role berhasil di dapatkan',
      data,
    };
  }
  @UseFilters(paramBadRequest)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(+id);
  }
  @UseFilters(paramBadRequest)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const { data, message } = await this.rolesService.update(
      +id,
      updateRoleDto,
    );
    return {
      message: message || 'role berhasil di ubah',
      data: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const isDelete = await this.rolesService.remove(+id);
    if (isDelete) {
      return {
        message: 'role berhasil di hapus',
      };
    }
  }
}
