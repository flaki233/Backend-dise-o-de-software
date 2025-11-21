import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SuggestionQueryDto {
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Opcional: limitar a una categoría específica (categoriaId)',
  })
  @IsOptional()
  @IsString()
  categoriaId?: string;
}
