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
    try {
      const { tokens } = await this.authClient.getToken(code);
      this.authClient.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: this.authClient,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();

      if (!data || !data.email) {
        return {
          message: 'Data pengguna tidak ditemukan dari Google.',
        };
      }

      let user = await this.prismaService.user.findFirst({
        where: {
          email: {
            equals: data.email,
          },
        },
      });

      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            email: data.email,
            username: data.given_name || 'google_user',
          },
        });
      }

      return {
        message: 'Login berhasil',
        id: user.id,
      };
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      return {
        message: 'Terjadi kesalahan saat otentikasi dengan Google.',
        error: error?.message || 'Unknown error',
      };
    }
  }
}
