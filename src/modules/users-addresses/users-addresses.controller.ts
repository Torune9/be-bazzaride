import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersAddressesService } from './users-addresses.service';
import { CreateUsersAddressDto } from './dto/create-users-address.dto';
import { UpdateUsersAddressDto } from './dto/update-users-address.dto';

@Controller('users-addresses')
export class UsersAddressesController {
  constructor(private readonly usersAddressesService: UsersAddressesService) {}

  @Post()
  create(@Body() createUsersAddressDto: CreateUsersAddressDto) {
    return this.usersAddressesService.create(createUsersAddressDto);
  }

  @Get()
  findAll() {
    return this.usersAddressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersAddressesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUsersAddressDto: UpdateUsersAddressDto,
  ) {
    return this.usersAddressesService.update(+id, updateUsersAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersAddressesService.remove(+id);
  }
}
