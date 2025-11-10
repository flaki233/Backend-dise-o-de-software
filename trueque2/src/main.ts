import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar límites del body parser para manejar imágenes base64 grandes
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Trueque API')
    .setDescription('API para sistema de intercambio de productos (trueque). Permite gestionar ofertas, categorías, estados e imágenes de ofertas.')
    .setVersion('1.0')
    .addTag('oferta', 'Operaciones relacionadas con ofertas de trueque')
    .addTag('categoria', 'Operaciones relacionadas con categorías de ofertas')
    .addTag('estado', 'Operaciones relacionadas con estados de ofertas')
    .addTag('imagen-oferta', 'Operaciones relacionadas con imágenes de ofertas')
    .addBearerAuth()
    .setContact('Equipo de Desarrollo', 'https://example.com', 'support@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
