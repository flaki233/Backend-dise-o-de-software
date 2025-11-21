import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API de Autenticación y Ofertas')
    .setDescription('Documentación interactiva de los endpoints del backend')
    .setVersion('1.0')
    .addTag('Autenticación')
    .addTag('Ofertas')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Swagger disponible en http://localhost:${PORT}/api/docs`);
  console.log('[ENV] MOCK_ROBLE=', process.env.MOCK_ROBLE);

}

bootstrap();
