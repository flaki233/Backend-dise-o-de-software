import { CategoriaOfertaDto } from "./CategoriaOferta.dto";


export class CategoriaOfertaPaginateDto {
  data: CategoriaOfertaDto[];
  total: number;
  page: number;
  limit: number;
}
