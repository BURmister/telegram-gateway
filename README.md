# Telegram Gateway

Small NestJS proxy for sending Telegram messages from a server where direct Telegram access is available.

## API

`POST /api/telegram/send`

Headers:

```http
Authorization: Bearer <ROOT_SECRET>
Content-Type: application/json
```

Body:

```json
{
  "botToken": "123456:bot-token",
  "chatId": "-1001234567890",
  "message": "Deployment finished"
}
```

The service forwards the request to `https://api.telegram.org/bot<botToken>/sendMessage` and returns Telegram API response data.

## Environment

Copy `.env.example` to `.env` and set:

```dotenv
PORT=8080
ROOT_SECRET=change-me
```

## Run

```bash
pnpm install
pnpm start:dev
```

## Docker

```bash
docker compose up -d --build
docker compose logs -f telegram-gateway
docker compose down
```

## Tests

```bash
pnpm test
pnpm test:e2e
```
