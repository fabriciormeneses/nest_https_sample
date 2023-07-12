import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { FengService } from './feng/feng.service';
import { CacheModule } from '@nestjs/cache-manager';
import { VtexService } from './vtex/vtex.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    CacheModule.register(),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, FengService, VtexService],
})
export class AppModule {}
