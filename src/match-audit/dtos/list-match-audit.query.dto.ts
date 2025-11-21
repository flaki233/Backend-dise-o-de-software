import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { MatchAction, MatchStatus } from './create-match-audit.dto';

export class ListMatchAuditQueryDto {
  @ApiPropertyOptional() @IsOptional() @Transform(({value}) => Number(value)) @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional() @IsOptional() @Transform(({value}) => Number(value)) @IsNumber()
  pageSize?: number = 20;

  @ApiPropertyOptional() @IsOptional() @IsString() actorUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() proposerOfferId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responderOfferId?: string;

  @ApiPropertyOptional({ enum: MatchAction })  @IsOptional() @IsEnum(MatchAction)
  action?: MatchAction;

  @ApiPropertyOptional({ enum: MatchStatus })  @IsOptional() @IsEnum(MatchStatus)
  statusAfter?: MatchStatus;

  @ApiPropertyOptional() @IsOptional() @IsString() correlationId?: string;

  @ApiPropertyOptional({ description: 'ISO date (YYYY-MM-DD)' })
  @IsOptional() @IsString() from?: string;

  @ApiPropertyOptional({ description: 'ISO date (YYYY-MM-DD)' })
  @IsOptional() @IsString() to?: string;
}
