import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  app.set('trust proxy', 1);

  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://d38u0s6ayarqyq.cloudfront.net';

  // app.enableCors({
  //   origin: FRONTEND_ORIGIN,
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  //   exposedHeaders: ['Set-Cookie'],
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // });

  app.enableCors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    methods: '*',
    allowedHeaders: '*',
  });


  setupApp(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}

bootstrap();
