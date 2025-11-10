import { Controller, Get, Post, Put, Patch, Delete, HttpCode, HttpStatus, Request, Query, Body, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { EstadoService } from './estado.service';
//import { JwtVerifiedGuard } from 'src/guard/jwt-verified/jwt-verified.guard';
import { EstadoOfertaDto } from 'src/models/DTO/EstadoOferta.dto';
import { EstadoOfertaCreateDto } from 'src/models/DTO/EstadoOfertaCreate.dto';
import { EstadoOfertaPaginateDto } from 'src/models/DTO/EstadoOfertaPaginate.dto';
import { EstadoOfertaUpdateDto } from 'src/models/DTO/EstadoOfertaUpdate.dto';


@ApiTags('estado')
@Controller('estado')
export class EstadoController {
  constructor(private readonly estadoService: EstadoService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener categorías de ofertas',
    description: 'Obtiene una lista paginada de categorías de ofertas con filtros opcionales'
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
    name: 'nombre', 
    required: false, 
    type: String, 
    description: 'Filtrar por nombre de categoría',
    example: 'Borrador' 
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
    description: 'Lista de categorías obtenida exitosamente',
    type: EstadoOfertaPaginateDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parámetros de consulta inválidos' 
  })
  @HttpCode(HttpStatus.OK)
  async getEstados(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filters: any,
  ): Promise<EstadoOfertaPaginateDto> {
    return this.estadoService.getEstados(page, limit, filters);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async getEstadoById(@Param('id') id: number): Promise<EstadoOfertaDto> {
    return this.estadoService.getEstadoById(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva categoría de oferta',
    description: 'Crea una nueva categoría de oferta en el sistema'
  })
  @ApiBody({ 
    type: EstadoOfertaCreateDto,
    description: 'Datos para crear una nueva categoría de oferta'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Estado creado exitosamente',
    type: EstadoOfertaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createCategoria(
    @Body() createCategoriaDto: EstadoOfertaCreateDto,
    @Request() req: any,
  ): Promise<EstadoOfertaDto> {
    return this.estadoService.createEstado(createCategoriaDto);
  }

  @Put(':id')
  //@UseGuards(JwtVerifiedGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async updateCategoria(
    @Param('id') id: number,
    @Body() updateCategoriaDto: EstadoOfertaUpdateDto,
    @Request() req: any,
  ): Promise<EstadoOfertaDto> {
    updateCategoriaDto.estado_oferta_id = id;
    return this.estadoService.updateEstado(updateCategoriaDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar categoría de oferta',
    description: 'Elimina una categoría de oferta del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'ID de la categoría a eliminar',
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
    description: 'Estado eliminado exitosamente',
    type: EstadoOfertaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parámetros inválidos' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Categoría no encontrada' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async deleteCategoria(
    @Param('id') id: number,
    @Query('usuario_modificacion') usuario_modificacion: string,
    @Request() req: any,
  ): Promise<EstadoOfertaDto> {
    const username = usuario_modificacion; 
    return this.estadoService.deleteEstado(id, username);
  }
}