import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { ApiKeyGuard } from './common/guards/api-key.guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  app.useGlobalGuards(new ApiKeyGuard(configService));

  const port = process.env.PORT || 4200;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
