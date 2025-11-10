import { EstadoOfertaCreateDto } from "./EstadoOfertaCreate.dto";


export class EstadoOfertaPaginateDto {
  data: EstadoOfertaCreateDto[];
  total: number;
  page: number;
  limit: number;
}
