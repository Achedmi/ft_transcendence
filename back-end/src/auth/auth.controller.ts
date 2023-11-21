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
import { TFAGuard } from './guards/TFAGuard.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly helpersService: HelpersService,
  ) {}

  //===================================refreshing access token=====================================

  @UseGuards(UserRTGuard, TFAGuard)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @GetCurrent() user: User & { isTFAVerified },
  ) {
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
        isTFAVerified: user.isTFAVerified,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }

  //===================================logout=====================================

  @HttpCode(200)
  @UseGuards(UserATGuard, TFAGuard)
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
          isTFAVerified: false,
        });
      this.helpersService.setTokenCookies(response, accessToken, refreshToken);
      response.redirect('http://localhost:6969/');
      return;
    }
    const { accessToken, refreshToken } = await this.authService.signUp(
      req.user.profile.id,
      req.user.profile.username,
      req.user.profile._json.image.link,
    );

    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    response.redirect('http://localhost:6969/');
  }

  //enable TFA by sending the qr code and verifing it and auth number, by that, we ganna set
  //isTFAenabled as true in the DB and isTFAverified as true as well

  @UseGuards(UserATGuard)
  @Post('verifyTFA')
  async vefityTFA(
    @GetCurrent() user,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
        isTFAVerified: true,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return 'verified';
  }
}
