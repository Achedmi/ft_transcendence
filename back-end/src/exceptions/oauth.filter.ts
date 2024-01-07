import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { InternalOAuthError } from 'passport-oauth2';

@Catch(InternalOAuthError)
export class OauthExceptionFilter extends BaseExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    console.error(exception.message);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(process.env.FRONT_END_URL);
  }
}
