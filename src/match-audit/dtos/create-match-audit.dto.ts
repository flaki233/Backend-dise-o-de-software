import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum MatchAction {
  PROPOSE = 'PROPOSE',
  ACCEPT  = 'ACCEPT',
  REJECT  = 'REJECT',
  CANCEL  = 'CANCEL',
  SUGGEST = 'SUGGEST',
}
export enum MatchStatus {
  PENDING   = 'PENDING',
  ACCEPTED  = 'ACCEPTED',
  REJECTED  = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class CreateMatchAuditDto {
  @ApiProperty({ enum: MatchAction })
  @IsEnum(MatchAction)
  action!: MatchAction;

  @ApiPropertyOptional({ enum: MatchStatus })
  @IsOptional() @IsEnum(MatchStatus)
  statusAfter?: MatchStatus;

  @ApiPropertyOptional() @IsOptional() @IsString() actorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() actorIp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() proposerOfferId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responderOfferId?: string;

  @ApiPropertyOptional({ description: '0..1 o 0..100' })
  @IsOptional() @IsNumber()
  score?: number;

  @ApiPropertyOptional({ description: 'Agrupa eventos de la misma propuesta' })
  @IsOptional() @IsString()
  correlationId?: string;

  @ApiPropertyOptional({ description: 'Snapshot (query, filtros, etc.)' })
  @IsOptional()
  payload?: any;

  @ApiPropertyOptional({ description: 'ID externo (ROBLE u otro)' })
  @IsOptional() @IsString()
  externalRef?: string;
}
