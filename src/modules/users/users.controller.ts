import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { JwtCookieAuthGuard } from 'src/guard/jwt-cookie.guard';
import { Request, Response } from 'express';

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
  async login(@Body() loginUserDtoo: LoginUserDto, @Res() res: Response) {
    const { data, token } = await this.usersService.login(loginUserDtoo);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful', data });
  }

  @Get()
  async findAll() {
    const { data, message } = await this.usersService.findAll();
    return {
      message: message ? message : 'data user berhasil di dapatkan',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const { data } = await this.usersService.findOne(id);
    return {
      message: 'user ditemukan',
      data: data,
    };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('current/account')
  async me(@Req() req: Request) {
    const user = req['user'];
    const { data } = await this.usersService.me(user.id);
    return {
      message: 'login berhasil',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const { data, message } = await this.usersService.update(id, updateUserDto);

    if (data) {
      return {
        message,
        data,
      };
    }

    return {
      message,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
