import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Middleware para parsear JSON y formularios ---
  app.use(express.json({ limit: '5mb' })); // Aumenta el límite por si subes imágenes
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // --- Validaciones globales ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos no definidos en los DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades extra
      transform: true, // Convierte automáticamente tipos primitivos (string → number, etc.)
    }),
  );

  // --- Configuración de Swagger ---
  const config = new DocumentBuilder()
    .setTitle('API de Autenticación y Ofertas')
    .setDescription('Documentación interactiva de los endpoints del backend')
    .setVersion('1.0')
    .addTag('Autenticación')
    .addTag('Ofertas')
    .addBearerAuth() // Para endpoints protegidos con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true }, // Mantiene el token en el UI
  });

  // --- Iniciar servidor ---
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Swagger disponible en http://localhost:${PORT}/api/docs`);
}

bootstrap();
