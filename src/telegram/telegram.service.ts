import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly httpService: HttpService) {}

  async sendMessage(botToken: string, chatId: string, message: string) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, {
          chat_id: chatId,
          text: message,
        }),
      );
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown Telegram error';
      this.logger.error(`[sendMessage] ${message}`);
      throw new BadGatewayException('Telegram request failed');
    }
  }
}
