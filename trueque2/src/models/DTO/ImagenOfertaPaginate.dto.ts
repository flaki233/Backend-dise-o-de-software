import { ImagenOfertaDto } from './ImagenOferta.dto';

export class ImagenOfertaPaginateDto {
  data: ImagenOfertaDto[];
  total: number;
  page: number;
  limit: number;
}