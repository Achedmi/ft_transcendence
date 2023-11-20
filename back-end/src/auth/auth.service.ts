import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/loginDto';
import * as bcrypt from 'bcrypt';
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

  async defaultLogin(loginDto: LoginDto) {
    const result = await this.userService.findUnique(loginDto);
    if (
      !result.password ||
      !bcrypt.compareSync(loginDto.password, result.password)
    )
      throw new ForbiddenException('Invalid credentials');
    const payload = { id: result.id, username: result.username };
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken(payload);
    const { password, ...user } = result;
    this.socketGateway.server.emit('status', { id: user.id, status: 'online' });
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
