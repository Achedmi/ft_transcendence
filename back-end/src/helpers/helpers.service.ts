import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class HelpersService {
  constructor(private readonly jwtService: JwtService) {}
  async generateAccessToken(payload) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });
  }

  async generateRefreshToken(payload) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  async generateRefreshAndAccessToken(payload): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.generateRefreshToken(payload);
    const accessToken = await this.generateAccessToken(payload);
    return {
      refreshToken,
      accessToken,
    };
  }

  setTokenCookies(response: Response, accessToken: string, refreshToken: string) {
    response.cookie('userAT', accessToken, {
      httpOnly: true,
    });
    response.cookie('userRT', refreshToken, {
      httpOnly: true,
    });
  }

  async hashPassword(password: string) {
    if (!password) return password;
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
