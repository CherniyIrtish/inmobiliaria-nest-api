import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });

  app.set('trust proxy', 1);

  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://d38u0s6ayarqyq.cloudfront.net';

  app.enableCors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  setupApp(app);

  const isDocsEnv = ['development', 'test'].includes(process.env.NODE_ENV ?? '');

  if (isDocsEnv) {
    const config = new DocumentBuilder()
      .setTitle('Inmobiliaria API')
      .setDescription('API documentation')
      .setVersion('1.0.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/api', app, document, {
      swaggerOptions: { persistAuthorization: true },
      customSiteTitle: 'Inmobiliaria API Docs',
    });
  }


  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}

bootstrap();
