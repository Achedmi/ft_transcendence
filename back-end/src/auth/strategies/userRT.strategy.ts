import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'userRefreshToken',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) return req.cookies['userRT'];
        },
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    const user: Omit<User, 'password'> = await this.userService.findOne(
      payload.id,
    );
    return {
      ...user,
      userAT: request.cookies?.userAT,
      userRT: request.cookies?.userRT,
    };
  }
}
