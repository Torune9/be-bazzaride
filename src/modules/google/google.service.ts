import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleService {
  public authClient: OAuth2Client;
  private scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];
  constructor(
    config: ConfigService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {
    this.authClient = new google.auth.OAuth2(
      config.get('GOOGLE_CLIENT_ID'),
      config.get('GOOGLE_SECRET_ID'),
      'http://localhost:3000/api/auth/google/callback',
    );
  }

  authUrl() {
    const url = this.authClient.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      include_granted_scopes: true,
    });
    return url;
  }

  async authGoogle(code: string) {
    const { tokens } = await this.authClient.getToken(code);
    this.authClient.setCredentials(tokens);
    const oauth2 = google.oauth2({
      auth: this.authClient,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data) {
      return {
        message: 'data tidak ditemukan',
      };
    }

    let user = await this.prismaService.user.findFirst({
      where: {
        email: {
          equals: data.email as string,
        },
      },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: data.email as string,
          username: data.given_name as string,
        },
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'login berhasil',
      token,
      roleId: user.roleId,
    };
  }
}
