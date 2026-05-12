import { IsNotEmpty, IsString } from 'class-validator';

export class SendTelegramMessageDto {
  @IsString()
  @IsNotEmpty()
  botToken: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
