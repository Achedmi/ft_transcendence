import { IntraGuard } from './guards/intra.guard';
import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto';
import { Response } from 'express';
import { GetCurrent } from './decorator/current.decorator';
import { User } from '@prisma/client';
import { UserRTGuard } from './guards/userRTGuard.guard';
import { UserATGuard } from './guards/userATGuard.guard';
import { UserService } from 'src/user/user.service';
import { HelpersService } from 'src/helpers/helpers.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly helpersService: HelpersService,
  ) {}

  //===================================loging with username and password=====================================
  @Post('defaultLogin')
  async defaultLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.defaultLogin(loginDto);
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return user;
  }

  //===================================refreshing access token=====================================
  @UseGuards(UserRTGuard)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @GetCurrent() user: User,
  ) {
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }

  //===================================logout=====================================
  @HttpCode(200)
  @UseGuards(UserATGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('userAT');
    response.clearCookie('userRT');
    return { message: `Logged out successfully` };
  }

  @UseGuards(IntraGuard)
  @Get('intra/login')
  intraLogin() {}

  @UseGuards(IntraGuard)
  @Get('intra/callback')
  async intraLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findUnique({
      intraId: req.user.profile.id,
    });
    if (user) {
      const { accessToken, refreshToken } =
        await this.helpersService.generateRefreshAndAccessToken({
          id: user.id,
          username: user.username,
        });
      this.helpersService.setTokenCookies(response, accessToken, refreshToken);
      response.redirect('http://localhost:9696/auth/intra/home');
      return;
    }
    const { accessToken, refreshToken } = await this.authService.signUp(
      req.user.profile.id,
    );
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    response.redirect('http://localhost:9696/auth/intra/SignUp');
  }

  @UseGuards(UserATGuard)
  @Get('intra/SignUp')
  intraSignup(@GetCurrent() user: User) {
    if (user.username) return 'HOME';
    return 'SIGNUP';
  }

  @UseGuards(UserATGuard)
  @Get('intra/home')
  intraHome(@GetCurrent() user: User) {
    return 'HOME';
  }
}
