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
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    const { code } = req.query;
    const result = await this.googleService.authGoogle(code as string);
    if (result.error) {
      return res.status(500).json({
        message: 'error ketika login',
        errors: result.error,
      });
    }
    res.cookie('access_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    return res.redirect(`http://localhost:5000/auth/success`);
  }
}
