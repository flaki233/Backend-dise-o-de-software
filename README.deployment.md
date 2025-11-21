# Backend - Proyecto Trueque

API REST con NestJS para el sistema de trueque de objetos.

## Desarrollo Local

```bash
# Instalar dependencias
bun install

# Ejecutar en desarrollo
bun run start:dev

# Build
bun run build

# Ejecutar producción
bun run start:prod

# Docker
docker-compose up -d
```

## Variables de Entorno

Crea un archivo `.env`:

```env
NODE_ENV=development
RECAPTCHA_SECRET_KEY=6Lf7ZRQsAAAAAG-miMeFy8aKDz_20Y9GO30915Gq
RECAPTCHA_SITE_KEY=6Lf7ZRQsAAAAAHUI3Jd8esdqfFBmiCxExeXWb7_z
RECAPTCHA_TEST=true
ROBLE_API_URL=https://roble-api.openlab.uninorte.edu.co
ROBLE_PROJECT_TOKEN=trueque_29b341a61b
JWT_SECRET=yHj38fnskL_29adPqQp93sKD
```

## Deploy en Vercel

Ver [DEPLOY.md](../DEPLOY.md) para instrucciones completas.

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

Asegúrate de configurar todas las variables de entorno en Vercel (ver `.env.production.example`).

## Endpoints

- `POST /auth/register` - Registrar usuario (con verificación de email)
- `POST /auth/register-direct` - Registrar usuario directo (sin verificación)
- `POST /auth/verify-email` - Verificar email con código
- `POST /auth/login` - Iniciar sesión
- `POST /auth/forgot-password` - Solicitar reseteo de contraseña
- `POST /auth/reset-password` - Resetear contraseña
- `GET /users/profile` - Obtener perfil del usuario
- `PUT /users/profile` - Actualizar perfil
- `GET /ofertas/public` - Listar ofertas públicas
- `POST /ofertas` - Crear oferta
- `GET /categorias` - Listar categorías

Documentación completa en: `http://localhost:3000/api/docs`

## Estructura

- `/src/auth` - Módulo de autenticación
- `/src/users` - Módulo de usuarios
- `/src/ofertas` - Módulo de ofertas
- `/src/categorias` - Módulo de categorías
- `/src/trades` - Módulo de intercambios
- `/src/roble` - Integración con API ROBLE
- `/src/recaptcha` - Validación de reCAPTCHA
- `/src/mail` - Servicio de correo electrónico

## Tecnologías

- NestJS
- TypeScript
- JWT Authentication
- Swagger/OpenAPI
- Google reCAPTCHA v3
- ROBLE API (Backend as a Service)
