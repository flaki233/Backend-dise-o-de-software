import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsJSON, IsIn } from 'class-validator';

export class CreateTradeDto {
  @ApiProperty() @IsInt()
  proposerId!: number;

  @ApiProperty() @IsInt()
  responderId!: number;

  @ApiProperty({ description: 'Oferta del proponente (estructura libre)' })
  @IsJSON()
  proposerOfferJson!: string;

  @ApiProperty({ description: 'Oferta del respondedor (estructura libre)' })
  @IsJSON()
  responderOfferJson!: string;
}

export class ConfirmTradeDto {
  @ApiProperty() @IsInt()
  userId!: number;         // normalmente lo sacas del JWT en un interceptor/guard

  @ApiProperty() @IsBoolean()
  accept!: boolean;        // true = confirma, false = rechaza/cancela
}

export class DecisionDto {
  @ApiProperty({ enum: ['accept', 'reject'] }) @IsIn(['accept', 'reject'])
  decision!: 'accept' | 'reject';

  @ApiProperty() @IsInt()
  userId!: number; // idem: en real lo tomas del token
}
