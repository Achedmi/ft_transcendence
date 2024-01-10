import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserService } from 'src/user/user.service';

@Injectable()
export class TFAStrategy extends PassportStrategy(Strategy, 'TFA') {
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

    const { isTFAenabled, username, isSetupCompleted } = user;

    // if (!user?.isSetupCompleted) throw new ForbiddenException({ isTFAenabled, username, isSetupCompleted, isTFAVerified: payload.isTFAVerified });
    if (user?.isTFAenabled && !payload.isTFAVerified) throw new ForbiddenException({ isTFAenabled, username, isSetupCompleted, isTFAVerified: payload.isTFAVerified });
    return {
      ...user,
      isTFAVerified: payload.isTFAVerified,
      userAT: request.cookies?.userAT,
      userRT: request.cookies?.userRT,
    };
  }
}
