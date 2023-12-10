import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { authenticator } from 'otplib';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly helpersService: HelpersService,
  ) {}

  async signUp(username: string, avatar: string) {
    const user = await this.userService.create({
      username,
      avatar,
      displayName: username,
    });
    const payload = { id: user.id, username };
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken(payload);
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

  async verifyTFA(code: string, TFAsecret: string) {
    try {
      return authenticator.verify({
        token: code,
        secret: TFAsecret,
      });
    } catch (error) {
      return false;
    }
  }

  async toggleTFA(user: User) {
    await this.userService.update(undefined, user.id, {
      isTFAenabled: !user.isTFAenabled,
    });
  }
}
