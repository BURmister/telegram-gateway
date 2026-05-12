import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TelegramService } from './telegram.service';

describe('TelegramService', () => {
  let service: TelegramService;
  const httpService = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    httpService.post.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelegramService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get(TelegramService);
  });

  it('posts message to Telegram using request bot token', async () => {
    httpService.post.mockReturnValue(of({ data: { ok: true } }));

    await expect(
      service.sendMessage(
        '123456:bot-token',
        '-1001234567890',
        'Deployment finished',
      ),
    ).resolves.toEqual({ ok: true });

    expect(httpService.post).toHaveBeenCalledWith(
      'https://api.telegram.org/bot123456:bot-token/sendMessage',
      {
        chat_id: '-1001234567890',
        text: 'Deployment finished',
      },
    );
  });
});
