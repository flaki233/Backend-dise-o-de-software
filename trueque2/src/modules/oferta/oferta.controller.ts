import { Controller, Get, Post, Put, Patch, Delete, HttpCode, HttpStatus, Request, Query, Body, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OfertaService } from './oferta.service';
//import { JwtVerifiedGuard } from 'src/guard/jwt-verified/jwt-verified.guard';
import { OfertaDto } from 'src/models/DTO/Oferta.dto';
import { OfertaCreateDto } from 'src/models/DTO/OfertaCreate.dto';
import { OfertaPaginateDto } from 'src/models/DTO/OfertaPaginate.dto';
import { OfertaUpdateDto } from 'src/models/DTO/OfertaUpdate.dto';
import { OfertaFiltersDto } from 'src/models/DTO/OfertaFilters.dto';


@ApiTags('oferta')
@Controller('oferta')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener ofertas',
    description: 'Obtiene una lista paginada de ofertas con filtros opcionales'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Número de página para la paginación',
    example: 1 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Cantidad de elementos por página',
    example: 10 
  })
  @ApiQuery({ 
    name: 'titulo', 
    required: false, 
    type: String, 
    description: 'Filtrar por título de la oferta',
    example: 'Intercambio de libros' 
  })
  @ApiQuery({ 
    name: 'categoria_oferta_id', 
    required: false, 
    type: Number, 
    description: 'Filtrar por ID de categoría',
    example: 1 
  })
  @ApiQuery({ 
    name: 'estado_oferta_id', 
    required: false, 
    type: Number, 
    description: 'Filtrar por ID de estado de oferta',
    example: 1 
  })
  @ApiQuery({ 
    name: 'estado', 
    required: false, 
    type: Number, 
    description: 'Filtrar por estado activo/inactivo',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de ofertas obtenida exitosamente',
    type: OfertaPaginateDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parámetros de consulta inválidos' 
  })
  @HttpCode(HttpStatus.OK)
  async getOfertas(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filters: OfertaFiltersDto,
  ): Promise<OfertaPaginateDto> {
    return this.ofertaService.getOfertas(page, limit, filters);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener oferta por ID',
    description: 'Obtiene los detalles de una oferta específica por su ID'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID de la oferta a obtener',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Oferta encontrada exitosamente',
    type: OfertaDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Oferta no encontrada' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async getOfertaById(@Param('id') id: number): Promise<OfertaDto> {
    return this.ofertaService.getOfertaById(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva oferta',
    description: 'Crea una nueva oferta en el sistema'
  })
  @ApiBody({ 
    type: OfertaCreateDto,
    description: 'Datos para crear una nueva oferta'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Oferta creada exitosamente',
    type: OfertaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoría o estado no encontrado' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createOferta(
    @Body() createOfertaDto: OfertaCreateDto,
    @Request() req: any,
  ): Promise<OfertaDto> {
    return this.ofertaService.createOferta(createOfertaDto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Actualizar oferta',
    description: 'Actualiza una oferta existente en el sistema'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID de la oferta a actualizar',
    example: 1 
  })
  @ApiBody({ 
    type: OfertaUpdateDto,
    description: 'Datos para actualizar la oferta'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Oferta actualizada exitosamente',
    type: OfertaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Oferta, categoría o estado no encontrado' 
  })
  //@UseGuards(JwtVerifiedGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async updateOferta(
    @Param('id') id: number,
    @Body() updateOfertaDto: OfertaUpdateDto,
    @Request() req: any,
  ): Promise<OfertaDto> {
    return this.ofertaService.updateOferta(id, updateOfertaDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar oferta',
    description: 'Elimina una oferta del sistema (eliminación lógica)'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID de la oferta a eliminar',
    example: 1 
  })
  @ApiQuery({ 
    name: 'usuario_modificacion', 
    required: true, 
    type: String, 
    description: 'Usuario que realiza la modificación',
    example: 'admin' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Oferta eliminada exitosamente',
    type: OfertaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parámetros inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Oferta no encontrada' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async deleteOferta(
    @Param('id') id: number,
    @Query('usuario_modificacion') usuario_modificacion: string,
    @Request() req: any,
  ): Promise<OfertaDto> {
    const username = usuario_modificacion; 
    return this.ofertaService.deleteOferta(id, username);
  }

  @Post('con-imagenes')
  @ApiOperation({ 
    summary: 'Crear oferta con imágenes',
    description: 'Crea una nueva oferta junto con sus imágenes en base64'
  })
  @ApiBody({ 
    type: OfertaCreateDto,
    description: 'Datos de la oferta incluyendo array de imágenes en base64'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Oferta con imágenes creada exitosamente',
    type: Object
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos inválidos proporcionados' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createOfertaConImagenes(
    @Body() createOfertaDto: OfertaCreateDto,
    @Request() req: any,
  ): Promise<any> {
    return this.ofertaService.createOfertaConImagenes(createOfertaDto);
  }

  @Get(':id/con-imagenes')
  @ApiOperation({ 
    summary: 'Obtener oferta con sus imágenes',
    description: 'Obtiene los detalles de una oferta específica junto con todas sus imágenes'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID único de la oferta',
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Oferta con imágenes obtenida exitosamente',
    type: Object
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Oferta no encontrada' 
  })
  @HttpCode(HttpStatus.OK)
  async getOfertaConImagenes(
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<any> {
    return this.ofertaService.getOfertaConImagenes(id);
  }
}