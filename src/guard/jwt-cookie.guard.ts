/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.['access_token'];

    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token);
      req['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
}
