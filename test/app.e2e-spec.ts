import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { ApiKeyGuard } from '../src/common/guards/api-key.guard';
import { TelegramService } from '../src/telegram/telegram.service';

describe('Telegram gateway (e2e)', () => {
  let app: INestApplication<App>;
  const telegramService = {
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    process.env.ROOT_SECRET = 'test-root-secret';
    telegramService.sendMessage.mockReset();
    telegramService.sendMessage.mockResolvedValue({ ok: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TelegramService)
      .useValue(telegramService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalGuards(new ApiKeyGuard(app.get(ConfigService)));

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('sends a telegram message using request bot token and chat id', async () => {
    await request(app.getHttpServer())
      .post('/api/telegram/send')
      .set('Authorization', 'Bearer test-root-secret')
      .send({
        botToken: '123456:bot-token',
        chatId: '-1001234567890',
        message: 'Deployment finished',
      })
      .expect(201)
      .expect({ ok: true });

    expect(telegramService.sendMessage).toHaveBeenCalledWith(
      '123456:bot-token',
      '-1001234567890',
      'Deployment finished',
    );
  });

  it('rejects requests without the root secret', async () => {
    await request(app.getHttpServer())
      .post('/api/telegram/send')
      .send({
        botToken: '123456:bot-token',
        chatId: '-1001234567890',
        message: 'Deployment finished',
      })
      .expect(401);

    expect(telegramService.sendMessage).not.toHaveBeenCalled();
  });

  it('rejects bodies with extra fields', async () => {
    await request(app.getHttpServer())
      .post('/api/telegram/send')
      .set('Authorization', 'Bearer test-root-secret')
      .send({
        botToken: '123456:bot-token',
        chatId: '-1001234567890',
        message: 'Deployment finished',
        unused: true,
      })
      .expect(400);

    expect(telegramService.sendMessage).not.toHaveBeenCalled();
  });
});
