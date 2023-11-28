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
  BadRequestException,
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
import { toFileStream } from 'qrcode';

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
  @Get('generateTFAQrCode')
  async generateTFAQrCode(@GetCurrent() user, @Res() response: Response) {
    const { otpAuthUrl } = await this.authService.generateTFASecret(user);
    response.setHeader('content-type', 'image/png');
    return this.authService.qrCodeStreamPipe(response, otpAuthUrl);
  }

  @UseGuards(UserATGuard)
  @Post('enableTFA')
  async enableTFA(
    @GetCurrent() user: User,
    @Res({ passthrough: true }) response: Response,
    @Body('TFAcode') TFAcode,
  ) {
    const isValidCode = await this.authService.verifyTFA(
      TFAcode,
      user.TFAsecret,
    );
    if (!isValidCode) throw new BadRequestException('invalid code');
    await this.authService.toggleTFA(user);
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
        isTFAVerified: true,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return { message: 'TFA enabled' };
  }

  @UseGuards(TFAGuard)
  @Post('disableTFA')
  async disableTFA(
    @GetCurrent() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.toggleTFA(user);
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
        isTFAVerified: false,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return { message: 'TFA disabled' };
  }

  @UseGuards(UserATGuard)
  @Post('verifyTFAcode')
  async vefityTFA(
    @GetCurrent() user,
    @Res({ passthrough: true }) response: Response,
    @Body('TFAcode') TFAcode,
  ) {
    const isValidCode = await this.authService.verifyTFA(
      TFAcode,
      user.TFAsecret,
    );
    if (!isValidCode) throw new BadRequestException('invalid code');
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
        isTFAVerified: true,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return { message: 'TFA verified' };
  }

  //this login is just for postman
  @Post('defaultLogin')
  async defaultLogin(
    @Body() credentials,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: credentials.id,
        username: credentials.username,
        isTFAVerified: false,
      });
    this.helpersService.setTokenCookies(response, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }
}
