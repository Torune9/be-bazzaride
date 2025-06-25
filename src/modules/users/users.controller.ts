import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const { data } = await this.usersService.register(createUserDto);

    return {
      message: 'register berhasil',
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @Post('login')
  async login(@Body() loginUserDtoo: LoginUserDto) {
    const { data, token } = await this.usersService.login(loginUserDtoo);

    return {
      message: 'login berhasil',
      data: data,
      access_token: token,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { data } = await this.usersService.findOne(id);
    return {
      message: 'user ditemukan',
      data: data,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
