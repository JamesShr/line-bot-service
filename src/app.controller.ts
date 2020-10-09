import {
  Controller, Get,
} from '@nestjs/common';
@Controller('/')
export class AppController {
  @Get('/healthcheck')
  getHello(): Record<string, boolean> {
    return { ok: true };
  }
}
