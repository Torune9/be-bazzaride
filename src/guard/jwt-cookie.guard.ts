/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.['access_token'];
    console.log('token ->', token);

    if (!token) {
      throw new UnauthorizedException('Token tidak ditemukan di cookie');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = payload;
      console.log('payload ->', payload);
      return true;
    } catch (err) {
      console.error('JWT verify error:', err);
      throw new UnauthorizedException('Token tidak valid atau expired');
    }
  }
}
