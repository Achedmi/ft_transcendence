import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('logged in!');
    return 'Hello World!';
  }
}
