import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsJSON, IsIn } from 'class-validator';

export class CreateTradeDto {
  @ApiProperty({ example: '0ef7c445-f7ed-4fc4-9e28-33240cf5290b' })
  @IsString()
  proposerId!: string;

  @ApiProperty({ example: '54749e96-0492-4f4a-8647-13437b11418d' })
  @IsString()
  responderId!: string;

  @ApiProperty({ description: 'Oferta del proponente (estructura libre)', example: '{"offerId": "abc123", "title": "Mi Libro"}' })
  @IsJSON()
  proposerOfferJson!: string;

  @ApiProperty({ description: 'Oferta del respondedor (estructura libre)', example: '{"offerId": "xyz789", "title": "Mi Tablet"}' })
  @IsJSON()
  responderOfferJson!: string;
}

export class ConfirmTradeDto {
  @ApiProperty({ example: '0ef7c445-f7ed-4fc4-9e28-33240cf5290b' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  accept!: boolean;
}

export class DecisionDto {
  @ApiProperty({ enum: ['accept', 'reject'], example: 'accept' })
  @IsIn(['accept', 'reject'])
  decision!: 'accept' | 'reject';

  @ApiProperty({ example: '0ef7c445-f7ed-4fc4-9e28-33240cf5290b' })
  @IsString()
  userId!: string;
}
