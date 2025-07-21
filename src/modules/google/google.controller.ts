import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { GoogleService } from './google.service';
import { Request, Response } from 'express';

@Controller('auth')
export class GoogleController {
  constructor(private googleService: GoogleService) {}

  @Get('google')
  redirectUrl(@Res() res: Response) {
    return res.redirect(this.googleService.authUrl());
  }

  @Get('google/callback')
  async googleLogin(@Req() req: Request) {
    const { code } = req.query;
    const { data, message } = await this.googleService.authGoogle(
      code as string,
    );
    if (message) {
      return {
        message,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
    return {
      message: 'login berhasil',
      data,
    };
  }
}
