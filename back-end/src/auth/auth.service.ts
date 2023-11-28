import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly helpersService: HelpersService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async signUp(intraId: string, username: string, avatar: string) {
    const user = await this.userService.create({
      username,
      intraId,
      avatar,
    });
    const payload = { id: user.id, username };
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken(payload);
    console.log(accessToken, refreshToken);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async generateTFASecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.username, 'trans', secret);

    await this.userService.update(undefined, user.id, {
      TFAsecret: secret,
    });
    return {
      secret,
      otpAuthUrl,
    };
  }
  async qrCodeStreamPipe(stream: Response, otpPathUrl: string) {
    return toFileStream(stream, otpPathUrl);
  }

  async verifyTFA(code: string, TFAsecret: string) {
    return authenticator.verify({
      token: code,
      secret: TFAsecret,
    });
  }

  async toggleTFA(user: User) {
    await this.userService.update(undefined, user.id, {
      isTFAenabled: !user.isTFAenabled,
    });
  }
}
