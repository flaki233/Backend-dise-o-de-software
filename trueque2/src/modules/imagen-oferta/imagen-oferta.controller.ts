import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe,
  ValidationPipe,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ImagenOfertaService } from './imagen-oferta.service';
import { ImagenOfertaCreateDto } from 'src/models/DTO/ImagenOfertaCreate.dto';
import { ImagenOfertaUpdateDto } from 'src/models/DTO/ImagenOfertaUpdate.dto';
import { ImagenOfertaFiltersDto } from 'src/models/DTO/ImagenOfertaFilters.dto';

@ApiTags('imagen-oferta')
@Controller('imagen-oferta')
export class ImagenOfertaController {
  constructor(private readonly imagenOfertaService: ImagenOfertaService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las imágenes de ofertas con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Lista de imágenes de ofertas obtenida exitosamente.' })
  async getImagenesOferta(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query() filters: ImagenOfertaFiltersDto,
  ) {
    try {
      return await this.imagenOfertaService.getImagenesOferta(page, limit, filters);
    } catch (error) {
      throw new HttpException(
        'Error al obtener las imágenes de ofertas: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una imagen de oferta por ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la imagen de oferta' })
  @ApiResponse({ status: 200, description: 'Imagen de oferta encontrada.' })
  @ApiResponse({ status: 404, description: 'Imagen de oferta no encontrada.' })
  async getImagenOfertaById(@Param('id', ParseIntPipe) id: number) {
    return await this.imagenOfertaService.getImagenOfertaById(id);
  }

  @Get('oferta/:ofertaId')
  @ApiOperation({ summary: 'Obtener todas las imágenes de una oferta específica' })
  @ApiParam({ name: 'ofertaId', type: 'number', description: 'ID de la oferta' })
  @ApiResponse({ status: 200, description: 'Imágenes de la oferta encontradas.' })
  async getImagenesByOfertaId(@Param('ofertaId', ParseIntPipe) ofertaId: number) {
    return await this.imagenOfertaService.getImagenesByOfertaId(ofertaId);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva imagen de oferta' })
  @ApiResponse({ status: 201, description: 'Imagen de oferta creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  async createImagenOferta(@Body(ValidationPipe) createImagenOfertaDto: ImagenOfertaCreateDto) {
    return await this.imagenOfertaService.createImagenOferta(createImagenOfertaDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una imagen de oferta existente' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la imagen de oferta' })
  @ApiResponse({ status: 200, description: 'Imagen de oferta actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Imagen de oferta no encontrada.' })
  async updateImagenOferta(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateImagenOfertaDto: ImagenOfertaUpdateDto,
  ) {
    return await this.imagenOfertaService.updateImagenOferta(id, updateImagenOfertaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una imagen de oferta (eliminación lógica)' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID de la imagen de oferta' })
  @ApiQuery({ name: 'usuario_modificacion', required: false, type: String, description: 'Usuario que realiza la eliminación' })
  @ApiResponse({ status: 200, description: 'Imagen de oferta eliminada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Imagen de oferta no encontrada.' })
  async deleteImagenOferta(
    @Param('id', ParseIntPipe) id: number,
    @Query('usuario_modificacion') usuario_modificacion: string = 'system',
  ) {
    return await this.imagenOfertaService.deleteImagenOferta(id, usuario_modificacion);
  }
}