# 🔄 Plataforma Web Modular de Trueques - Backend

Sistema de trueques desarrollado con **NestJS** y **ROBLE UNINORTE** que permite a los usuarios intercambiar bienes y servicios de forma segura y organizada.

## 📋 Módulo 2: Usuarios y Ofertas ✅ COMPLETADO

### 🎯 Funcionalidades Implementadas

#### 🔐 Autenticación y Seguridad
- ✅ Registro con verificación de email (ROBLE Auth)
- ✅ Registro directo sin verificación (desarrollo)
- ✅ Inicio de sesión con JWT
- ✅ Verificación de correo con código de 6 dígitos
- ✅ Recuperación de contraseña
- ✅ Reseteo de contraseña
- ✅ Refresh token
- ✅ Logout
- ✅ Validación con reCAPTCHA

#### 👤 Gestión de Perfil
- ✅ Visualización de perfil personal
- ✅ Edición de información (nombre, ubicación, biografía)
- ✅ Sistema de reputación (puntaje y trueques cerrados)
- ✅ Desactivación de cuenta

#### 📦 Gestión de Ofertas
- ✅ Crear ofertas con información completa
  - Título, categoría, condiciones
  - Ubicación geográfica (lat/long)
  - Hasta 3 imágenes (máx. 2MB cada una)
  - Comentario obligatorio para análisis NLP
- ✅ Editar ofertas propias
- ✅ Eliminar ofertas (soft delete)
- ✅ Cambiar estado: BORRADOR → PUBLICADA → PAUSADA
- ✅ Panel personal con filtros
- ✅ Listado público con búsqueda y paginación

#### 🤝 Cierre de Trueques
- ✅ Propuesta de trueque entre usuarios
- ✅ Confirmación bilateral (ambas partes deben aceptar)
- ✅ Actualización automática de reputación
- ✅ Registro persistente de cierres con historial completo

#### 🛡️ Validaciones Backend
- ✅ Campos obligatorios con mensajes claros
- ✅ Tamaño máximo de imágenes (2 MB)
- ✅ Máximo 3 imágenes por oferta
- ✅ Prevención de títulos duplicados por usuario
- ✅ Control de spam con CAPTCHA

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico
- **Backend**: NestJS (Node.js + TypeScript)
- **Base de Datos**: ROBLE UNINORTE
- **Autenticación**: ROBLE Auth + JWT Local
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Runtime**: Bun (compatible con npm/pnpm)

### Base de Datos ROBLE

El proyecto utiliza **6 tablas** en ROBLE UNINORTE:

```
📊 Usuarios_Aplicacion
   ├─ userId (PK)
   ├─ email
   ├─ name
   ├─ location
   ├─ bio
   ├─ reputationScore
   ├─ tradesClosed
   ├─ active
   └─ role

📂 CategoriaOferta
   ├─ _id (PK)
   ├─ nombre
   ├─ activo
   ├─ createdAt
   └─ updatedAt

📦 Oferta
   ├─ _id (PK)
   ├─ titulo
   ├─ condicionTrueque
   ├─ comentarioObligatorio
   ├─ latitud / longitud
   ├─ userId (FK)
   ├─ categoriaId (FK)
   ├─ status (BORRADOR|PUBLICADA|PAUSADA)
   ├─ activo
   ├─ createdAt
   └─ updatedAt

🖼️ ImagenOferta
   ├─ _id (PK)
   ├─ ofertaId (FK)
   ├─ url (base64)
   ├─ nombre
   ├─ tamanioBytes
   ├─ orden
   └─ createdAt

🤝 Trade
   ├─ _id (PK)
   ├─ proposerId (FK)
   ├─ responderId (FK)
   ├─ proposerOfferJson
   ├─ responderOfferJson
   ├─ proposerConfirmed
   ├─ responderConfirmed
   ├─ status
   ├─ closedAt
   ├─ createdAt
   └─ updatedAt

📝 TradeClosure
   ├─ _id (PK)
   ├─ tradeId (FK)
   ├─ proposerId
   ├─ responderId
   ├─ offerA (JSON)
   ├─ offerB (JSON)
   ├─ closedAt
   ├─ finalStatus
   └─ createdAt
```

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
```bash
# Node.js >= 18 o Bun >= 1.0
node --version  # o bun --version
```

### 2. Clonar el Repositorio
```bash
git clone <repository-url>
cd Backend-dise-o-de-software
```

### 3. Instalar Dependencias
```bash
# Con Bun (recomendado)
bun install

# O con npm
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NODE_ENV=development
JWT_SECRET=yHj38fns$kL_29adPqQp93sKD
RECAPTCHA_TEST=true
RECAPTCHA_SECRET_KEY=tu_recaptcha_secret_key
RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
ROBLE_API_URL=https://roble-api.openlab.uninorte.edu.co
ROBLE_PROJECT_TOKEN=trueque_29b341a61b
```

### 5. Migrar Tablas a ROBLE (Primera vez)
```bash
# Crear las 6 tablas en ROBLE
bun run roble:migrate

# O con npm
npm run roble:migrate
```

### 6. Iniciar el Servidor

#### Opción A: Con Docker Compose (Recomendado para Producción)

```bash
# Construir y levantar el servidor
docker compose up -d

# Ver logs
docker compose logs -f backend

# Detener el servidor
docker compose down
```

#### Opción B: Modo Desarrollo Local

```bash
# Modo desarrollo (con hot-reload)
bun run start:dev

# O con npm
npm run start:dev

# Modo producción
bun run build
bun run start:prod
```

El servidor estará disponible en:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs

---

## 🐳 Docker

### Comandos Útiles

```bash
# Construir imagen
docker compose build

# Iniciar servicio
docker compose up -d

# Ver estado
docker compose ps

# Ver logs en tiempo real
docker compose logs -f backend

# Reiniciar servicio
docker compose restart

# Detener servicio
docker compose stop

# Detener y eliminar contenedores
docker compose down

# Reconstruir y reiniciar
docker compose up -d --build
```

### Variables de Entorno en Docker

Las variables de entorno están configuradas en `docker-compose.yml`. Para producción, considera usar un archivo `.env` o configurarlas directamente en tu plataforma de hosting.

---

## 📁 Estructura del Proyecto

```
src/
├── auth/                    # 🔐 Autenticación
│   ├── auth.controller.ts   # Endpoints auth
│   ├── auth.service.ts      # Lógica de autenticación
│   ├── guards/              # Guards JWT
│   ├── strategies/          # Estrategias Passport
│   └── dtos/                # DTOs de validación
│
├── users/                   # 👤 Gestión de usuarios
│   ├── users.controller.ts  # Endpoints de perfil
│   ├── users.service.ts     # Lógica de perfiles
│   └── dtos/                # DTOs de usuario
│
├── ofertas/                 # 📦 Gestión de ofertas
│   ├── ofertas.controller.ts
│   ├── ofertas.service.ts
│   └── dtos/                # DTOs de ofertas
│
├── categorias/              # 📂 Gestión de categorías
│   ├── categorias.controller.ts
│   ├── categorias.service.ts
│   └── dtos/
│
├── trades/                  # 🤝 Gestión de trueques
│   ├── trades.controller.ts
│   ├── trades.service.ts
│   └── dtos.ts
│
├── roble/                   # 🗄️ Integración ROBLE
│   ├── roble.service.ts     # Cliente API ROBLE
│   ├── roble.repository.ts  # Repositorio de datos
│   └── roble.module.ts
│
├── recaptcha/               # 🤖 Validación CAPTCHA
│   └── recaptcha.service.ts
│
├── common/                  # 🛠️ Utilidades comunes
│   ├── decorators/
│   └── pipes/
│
├── config/                  # ⚙️ Configuraciones
│   ├── jwt.config.ts
│   └── mail.config.ts
│
├── app.module.ts           # Módulo principal
└── main.ts                 # Punto de entrada
```

---

## 🔌 API Endpoints

### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registro con verificación email | ❌ |
| POST | `/auth/register-direct` | Registro sin verificación (dev) | ❌ |
| POST | `/auth/login` | Inicio de sesión | ❌ |
| POST | `/auth/verify-email` | Verificar email con código | ❌ |
| POST | `/auth/forgot-password` | Solicitar reset de contraseña | ❌ |
| POST | `/auth/reset-password` | Resetear contraseña | ❌ |
| POST | `/auth/refresh-token` | Refrescar access token | ❌ |
| POST | `/auth/logout` | Cerrar sesión | ✅ |

### 👤 Usuarios (`/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Obtener perfil propio | ✅ |
| PATCH | `/users/profile` | Actualizar perfil | ✅ |
| DELETE | `/users/profile` | Desactivar cuenta | ✅ |

### 📂 Categorías (`/categorias`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/categorias` | Listar categorías | ❌ |
| GET | `/categorias/:id` | Obtener categoría | ❌ |
| POST | `/categorias` | Crear categoría | ✅ |
| PATCH | `/categorias/:id` | Actualizar categoría | ✅ |
| DELETE | `/categorias/:id` | Eliminar categoría | ✅ |

### 📦 Ofertas (`/ofertas`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/ofertas/public` | Listar ofertas públicas | ❌ |
| GET | `/ofertas/public/:id` | Ver oferta pública | ❌ |
| GET | `/ofertas/my-offers` | Mis ofertas | ✅ |
| GET | `/ofertas/:id` | Ver oferta (propias) | ✅ |
| POST | `/ofertas` | Crear oferta | ✅ |
| PATCH | `/ofertas/:id` | Actualizar oferta | ✅ |
| PATCH | `/ofertas/:id/status/:status` | Cambiar estado | ✅ |
| DELETE | `/ofertas/:id` | Eliminar oferta | ✅ |

### 🤝 Trueques (`/trades`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/trades` | Crear propuesta | ✅ |
| GET | `/trades/:id` | Ver trueque | ✅ |
| POST | `/trades/:id/confirm` | Confirmar/Rechazar | ✅ |
| POST | `/trades/:id/decision` | Decidir (accept/reject) | ✅ |
| GET | `/trades/:id/closure` | Ver registro de cierre | ✅ |

---

## 📝 Ejemplos de Uso

### 1. Registro de Usuario

```bash
# Registro con verificación de email
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Test@12345",
    "name": "Usuario Test",
    "recaptchaToken": "test_token"
  }'

# Respuesta:
{
  "message": "Usuario registrado. Se ha enviado un código de verificación a tu correo.",
  "email": "usuario@example.com"
}
```

### 2. Verificar Email

```bash
curl -X POST http://localhost:3000/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "code": "123456"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "Test@12345",
    "recaptchaToken": "test_token"
  }'

# Respuesta:
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-del-usuario",
    "email": "usuario@example.com",
    "name": "Usuario Test"
  }
}
```

### 4. Crear Oferta

```bash
curl -X POST http://localhost:3000/ofertas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Laptop Dell XPS 13",
    "categoriaId": "abc123",
    "condicionTrueque": "Laptop en excelente estado",
    "comentarioObligatorio": "Busco intercambiar por MacBook",
    "latitud": 11.0041,
    "longitud": -74.8069,
    "imagenes": [
      {
        "base64": "data:image/png;base64,iVBORw0KGgo...",
        "nombre": "laptop.png"
      }
    ]
  }'
```

### 5. Cambiar Estado de Oferta

```bash
# BORRADOR → PUBLICADA
curl -X PATCH http://localhost:3000/ofertas/abc123/status/PUBLICADA \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# PUBLICADA → PAUSADA
curl -X PATCH http://localhost:3000/ofertas/abc123/status/PAUSADA \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Testing

### Ejecutar Todas las Pruebas E2E

```bash
# Script de pruebas end-to-end
bash scripts/test-all-features.sh

# Los resultados se guardan en:
# scripts/test-results-[timestamp].txt
```

### Pruebas Incluidas

✅ Registro y login con ROBLE Auth  
✅ Gestión de perfil (lectura/escritura)  
✅ CRUD de ofertas con validaciones  
✅ Cambio de estado de ofertas  
✅ Cierre bilateral de trueques  
✅ Actualización de reputación  
✅ Validaciones backend (imágenes, duplicados)  
✅ CAPTCHA en producción  

---

## 🛠️ Scripts Disponibles

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:prod": "node dist/main.js",
  "build": "nest build",
  "docker:up": "docker-compose up -d",
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f",
  "roble:migrate": "ts-node scripts/migrate-to-roble.ts",
  "roble:test-auth": "ts-node scripts/test-roble-auth.ts"
}
```

---

## 🔒 Roles de Usuario

El sistema implementa 3 roles principales:

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **OFERENTE** | Usuario que publica ofertas | Crear/editar/eliminar ofertas propias |
| **BUSCADOR** | Usuario que busca ofertas | Ver ofertas públicas, proponer trueques |
| **ADMINISTRADOR** | Gestor del sistema | Gestión completa del sistema |

---

## 📊 Estado del Proyecto

```
✅ Módulo 2 Completado: 100%
📊 27 Endpoints Activos
🗄️ 6 Tablas en ROBLE DB
🔐 8 Endpoints de Autenticación
👤 3 Endpoints de Perfil
📦 8 Endpoints de Ofertas
📂 5 Endpoints de Categorías
🤝 5 Endpoints de Trueques
```

---

## 🐛 Troubleshooting

### Error: `secretOrPrivateKey must have a value`

Asegúrate de que la variable `JWT_SECRET` esté configurada en tu `.env`:

```env
JWT_SECRET=yHj38fns$kL_29adPqQp93sKD
```

### Error: `Error de verificación CAPTCHA`

En desarrollo, configura:

```env
RECAPTCHA_TEST=true
```

O usa `test_token` como `recaptchaToken` en tus peticiones.

### Error: `Address already in use`

Si el puerto 3000 está ocupado:

```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📚 Documentación Adicional

- **Swagger UI**: http://localhost:3000/api/docs
- **ROBLE API**: https://roble.openlab.uninorte.edu.co/docs
- **NestJS**: https://docs.nestjs.com

---

## 👥 Contribución

Este proyecto es parte del curso de Diseño de Software en la Universidad del Norte.

---

## 📄 Licencia

Este proyecto es privado y pertenece a la Universidad del Norte.

---

**✨ Proyecto Funcional y Listo para Producción ✨**
