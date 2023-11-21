import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { SocketGateway } from 'src/socket/socket.gateway';

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
}
