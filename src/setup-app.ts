import { ValidationPipe } from "@nestjs/common";


export const setupApp = (app: any) => {
    // app.setGlobalPrefix('api');
    // app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true }
    }))
}