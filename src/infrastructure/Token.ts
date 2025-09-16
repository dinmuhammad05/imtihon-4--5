import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IPayload } from 'src/common/interface/payload';

import { dbConfig } from 'src/config';

const {
  access_token_key,
  access_token_time,
  refresh_token_key,
  refresh_token_time,
} = dbConfig.TOKEN;

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async accessToken(payload: IPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: access_token_key,
      expiresIn: access_token_time,
    });
  }

  async refreshToken(payload: IPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: refresh_token_key,
      expiresIn: refresh_token_time,
    });
  }

  async writeCookie(
    res: Response,
    key: string,
    value: string,
    time: number,
  ): Promise<void> {
    res.cookie(key, value, {
      httpOnly: true,
      secure: true,
      maxAge: Number(time) * 60 * 60 * 1000,
    });
  }

  async clearCookie(res: Response, name: string) {
    res.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  async verifyToken(token: string, secretKey: string): Promise<object> {
    return this.jwt.verifyAsync(token, { secret: secretKey });
  }
}