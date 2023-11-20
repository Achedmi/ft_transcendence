import { AuthService } from 'src/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'userAccessToken',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) return req.cookies['userAT'];
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request, payload) {
    let user = await this.userService.findOne(payload.id);
    return {
      ...user,
      userAT: request.cookies?.userAT,
      userRT: request.cookies?.userRT,
    };
  }
}
