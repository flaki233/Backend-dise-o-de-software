import { OfertaDto } from './Oferta.dto';

export class ImagenOfertaDto {
  imagen_oferta_id: number;
  oferta: OfertaDto;
  imagen_oferta_nombre: string;
  imagen_oferta_ruta: string;
  usuario_creacion?: string;
  fecha_creacion?: string;
  usuario_modificacion?: string;
  fecha_modificacion?: string;
  estado_registro?: number;
}