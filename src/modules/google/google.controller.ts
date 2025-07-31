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
    const result = await this.googleService.authGoogle(code as string);

    return {
      message: result.message,
      token: result.token,
      roleId: result.roleId,
      statusCode: HttpStatus.ACCEPTED,
    };
  }
}
