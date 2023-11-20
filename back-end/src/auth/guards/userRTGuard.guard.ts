import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserRTGuard extends AuthGuard('userRefreshToken') {}
