Este proyecto implementa el módulo de usuarios y autenticación para la aplicación Trueque, desarrollado con NestJS, Prisma y PostgreSQL.
Incluye registro, inicio de sesión con JWT, verificación por correo, recuperación de contraseña y gestión de perfil de usuario.

🧠 Funcionalidades implementadas

PUNTO 1 — Registro y autenticación de usuarios

Creación de cuenta con correo electrónico único.

Validación de correo mediante enlace de verificación.

Inicio de sesión con credenciales y generación de JWT.

Recuperación y restablecimiento de contraseña vía correo electrónico.

PUNTO 2 — Gestión de perfil de usuario

Edición de información personal (nombre, ubicación, biografía).

Visualización de reputación (puntaje y número de trueques).

Posibilidad de desactivar la cuenta.

 Tecnologías utilizadas

Node.js + NestJS
Prisma ORM + PostgreSQL
JWT (JSON Web Token)
Mailhog para pruebas de correo
TypeScript

 Iniciar el proyecto

1. Instalar dependencias
npm install

2. Levantar los servicios con Docker
docker-compose up -d

Esto inicia:

PostgreSQL en localhost:5432

Mailhog en http://localhost:8025

3. Generar las tablas en la base de datos
npx prisma migrate dev --name init

🧩 Estructura del proyecto

src/
├── auth/
│ ├── auth.controller.ts → Rutas de autenticación
│ ├── auth.service.ts → Lógica de registro, login, recuperación
│ ├── dtos/ → Validaciones (register, login, reset)
├── users/
│ ├── users.controller.ts → Rutas de perfil (GET, PATCH, DELETE)
│ ├── users.service.ts → Lógica de perfil y reputación
│ ├── dtos/update-user.dto.ts → Validaciones de edición
├── prisma/
│ ├── prisma.service.ts → Conexión a la base de datos
│ ├── schema.prisma → Modelo de usuario
└── main.ts → Punto de entrada del servidor

4. Registro y autenticación de usuarios

Registro de usuario (POST /auth/register)
Body:
{ "email": "usuario@example.com
", "password": "clave123" }
Crea el usuario y envía un correo de verificación visible en Mailhog (http://localhost:8025
).

Verificación de correo (GET /auth/verify?token=TOKEN)
Verifica el usuario en la base de datos (verified = true).

Inicio de sesión (POST /auth/login)
Body:
{ "email": "usuario@example.com
", "password": "clave123" }
Respuesta:
{ "message": "Inicio de sesión exitoso", "token": "JWT_TOKEN", "user": { "id": 1, "email": "usuario@example.com
" } }

Recuperar contraseña (POST /auth/forgot-password)
Body:
{ "email": "usuario@example.com
" }
Envía un correo con enlace de recuperación visible en Mailhog.

Restablecer contraseña (POST /auth/reset-password)
Body:
{ "token": "TOKEN_RECIBIDO", "newPassword": "nuevaClave123" }
Permite establecer una nueva contraseña e invalida el token.

5. Gestión de perfil de usuario

Ver perfil (GET /users/1)
Respuesta:
{ "id": 1, "email": "usuario@example.com
", "name": null, "location": null, "bio": null, "reputationScore": 0, "tradesClosed": 0, "active": true }

Editar perfil (PATCH /users/1)
Body:
{ "name": "Flaki", "location": "Colombia", "bio": "Apasionado por los trueques" }
Respuesta:
{ "message": "Perfil actualizado correctamente", "user": { "id": 1, "email": "flaki@example.com
", "name": "Flaki", "location": "Colombia", "bio": "Apasionado por los trueques" } }

Desactivar cuenta (DELETE /users/1)
Respuesta:
{ "message": "Cuenta desactivada correctamente" }
Marca el usuario como inactivo (active = false).

💌 Verificación de correos con Mailhog

Accede a http://localhost:8025

Ahí puedes visualizar los correos de verificación de cuenta y recuperación de contraseña.