import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.validApiKey = this.configService.get<string>('ROOT_SECRET') ?? '';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (!this.validApiKey || type !== 'Bearer' || token !== this.validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
