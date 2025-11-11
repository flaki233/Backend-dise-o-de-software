-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OFERENTE', 'BUSCADOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('BORRADOR', 'PUBLICADA', 'PAUSADA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'OFERENTE';

-- CreateTable
CREATE TABLE "categoria_oferta" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "categoria_oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "condicionTrueque" VARCHAR(255) NOT NULL,
    "comentarioObligatorio" VARCHAR(255) NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'BORRADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imagen_oferta" (
    "id" SERIAL NOT NULL,
    "ofertaId" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "nombre" VARCHAR(255),
    "tamanioBytes" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imagen_oferta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "oferta_userId_idx" ON "oferta"("userId");

-- CreateIndex
CREATE INDEX "oferta_categoriaId_idx" ON "oferta"("categoriaId");

-- CreateIndex
CREATE INDEX "oferta_status_idx" ON "oferta"("status");

-- CreateIndex
CREATE UNIQUE INDEX "oferta_titulo_userId_activo_key" ON "oferta"("titulo", "userId", "activo");

-- CreateIndex
CREATE INDEX "imagen_oferta_ofertaId_idx" ON "imagen_oferta"("ofertaId");

-- AddForeignKey
ALTER TABLE "oferta" ADD CONSTRAINT "oferta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oferta" ADD CONSTRAINT "oferta_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria_oferta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imagen_oferta" ADD CONSTRAINT "imagen_oferta_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "oferta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
