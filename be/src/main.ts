import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT) || 3000;
  const host = '0.0.0.0';
  const swaggerPath = 'api/docs';
  const localDevHosts = new Set(['localhost', '127.0.0.1', '[::1]']);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      try {
        const url = new URL(origin);
        const isAllowedLocalOrigin =
          url.protocol === 'http:' && localDevHosts.has(url.hostname);

        return callback(null, isAllowedLocalOrigin);
      } catch {
        return callback(new Error('Invalid CORS origin'), false);
      }
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shortener API')
    .setDescription('API documentation for the URL shortener service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(swaggerPath, app, swaggerDocument);

  await app.listen(port, host);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger docs available at: http://localhost:${port}/${swaggerPath}`,
  );
}
bootstrap();
