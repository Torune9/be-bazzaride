import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UsersAddressesService } from './users-addresses.service';
import { CreateUsersAddressDto } from './dto/create-users-address.dto';
import { UpdateUsersAddressDto } from './dto/update-users-address.dto';
import { JwtCookieAuthGuard } from 'src/guard/jwt-cookie.guard';

@UseGuards(JwtCookieAuthGuard)
@Controller('users-addresses')
export class UsersAddressesController {
  constructor(private readonly usersAddressesService: UsersAddressesService) {}

  @Post()
  create(@Body() createUsersAddressDto: CreateUsersAddressDto) {
    const address = this.usersAddressesService.create(createUsersAddressDto);
    return {
      message: 'address berhasil di buat',
      data: address,
    };
  }

  @Get()
  findAll() {
    return this.usersAddressesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { data } = await this.usersAddressesService.findOne(id);

    return {
      message: 'alamat berhasil di dapatkan',
      data,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsersAddressDto: UpdateUsersAddressDto,
  ) {
    const { data } = await this.usersAddressesService.update(
      id,
      updateUsersAddressDto,
    );
    return {
      message: 'alamat berhasil di update',
      data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersAddressesService.remove(id);
  }
}
