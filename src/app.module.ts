import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { TelegramController } from './telegram/telegram.controller';
import { TelegramService } from './telegram/telegram.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class AppModule {}
