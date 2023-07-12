import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestDTO } from './dto/request.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  async;
  @Post()
  @HttpCode(200)
  getUserByEmail(@Body() body: RequestDTO) {
    return this.appService.getUserByEmail(body.data.email);
  }
}
