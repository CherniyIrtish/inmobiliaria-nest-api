import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  app.set('trust proxy', 1);

  // const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://d38u0s6ayarqyq.cloudfront.net';
  // app.enableCors({
  //   origin: FRONTEND_ORIGIN,
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  //   exposedHeaders: ['Set-Cookie'],
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // });

  const http = app.getHttpAdapter().getInstance();
  http.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');

    const reqHeaders = req.headers['access-control-request-headers'];
    res.setHeader(
      'Access-Control-Allow-Headers',
      (typeof reqHeaders === 'string' && reqHeaders) || 'Content-Type, Authorization, X-Requested-With'
    );

    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });


  setupApp(app);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}

bootstrap();
