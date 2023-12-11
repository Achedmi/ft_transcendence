import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrent = createParamDecorator((data: string, context: ExecutionContext) => {
  const user = context.switchToHttp().getRequest()?.user;
  if (!data) return user;
  return user[data];
});
