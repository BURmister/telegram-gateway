import { Body, Controller, Post } from '@nestjs/common';

import { SendTelegramMessageDto } from './dto/send-telegram-message.dto';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('send')
  send(@Body() dto: SendTelegramMessageDto) {
    return this.telegramService.sendMessage(
      dto.botToken,
      dto.chatId,
      dto.message,
    );
  }
}
