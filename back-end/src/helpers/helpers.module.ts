import { Module } from '@nestjs/common';
import { HelpersService } from './helpers.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [HelpersService, JwtService],
  exports: [HelpersService],
})
export class HelpersModule {}
