import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class PropuestaDecisionDto {
  @ApiProperty({ example: 'userB-456' })
  @IsString() @IsNotEmpty()
  actorId!: string; // quién decide (debe ser proposer o responder)

  @ApiProperty({ enum: ['aceptar', 'rechazar'] })
  @IsIn(['aceptar', 'rechazar'])
  decision!: 'aceptar' | 'rechazar';
}

