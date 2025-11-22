// src/match-audit/dtos/list-match-audit.query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListMatchAuditQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por ID de propuesta (columna propuestaId)',
    example: '1p4PV3AyN9Avu',
  })
  @IsOptional()
  @IsString()
  propuestaId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por actorId (quién hizo la acción)',
    example: 'user-123',
  })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de evento',
    enum: ['CREADA', 'DECISION', 'CANCELADA'],
    example: 'CREADA',
  })
  @IsOptional()
  @IsString()
  tipo?: string;

  @ApiPropertyOptional({
    description: 'Desde esta fecha (ISO)',
    example: '2025-11-22T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Hasta esta fecha (ISO)',
    example: '2025-11-24T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({
    description: 'Número de página',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Tamaño de página',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
}
