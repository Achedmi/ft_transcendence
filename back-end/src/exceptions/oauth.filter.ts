import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { InternalOAuthError, TokenError, AuthorizationError } from 'passport-oauth2';

@Catch(TokenError, AuthorizationError, InternalOAuthError)
export class OauthExceptionFilter extends BaseExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(process.env.FRONT_END_URL);
  }
}
