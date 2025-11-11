import { Controller, Get, Post, Put, Patch, Delete, HttpCode, HttpStatus, Request, Query, Body, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoriaService } from './categoria.service';
//import { JwtVerifiedGuard } from 'src/guard/jwt-verified/jwt-verified.guard';
import { CategoriaOfertaDto } from 'src/models/DTO/CategoriaOferta.dto';
import { CategoriaOfertaCreateDto } from 'src/models/DTO/CategoriaOfertaCreate.dto';
import { CategoriaOfertaPaginateDto } from 'src/models/DTO/CategoriaOfertaPaginate.dto';
import { CategoriaOfertaFiltersDto } from 'src/models/DTO/CategoriaOfertaFilters.dto';
import { CategoriaOfertaUpdateDto } from 'src/models/DTO/CategoriaOfertaUpdate.dto';


@ApiTags('categoria')
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

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
    example: 'Electrónicos' 
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
    type: CategoriaOfertaPaginateDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Parámetros de consulta inválidos' 
  })
  @HttpCode(HttpStatus.OK)
  async getCategorias(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filters: any,
  ): Promise<CategoriaOfertaPaginateDto> {
    return this.categoriaService.getCategorias(page, limit, filters);
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async getCategoriaById(@Param('id') id: number): Promise<CategoriaOfertaDto> {
    return this.categoriaService.getCategoriaById(id);
  }

  @Post()
  @ApiOperation({ 
    summary: 'Crear nueva categoría de oferta',
    description: 'Crea una nueva categoría de oferta en el sistema'
  })
  @ApiBody({ 
    type: CategoriaOfertaCreateDto,
    description: 'Datos para crear una nueva categoría de oferta'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Categoría creada exitosamente',
    type: CategoriaOfertaDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async createCategoria(
    @Body() createCategoriaDto: CategoriaOfertaCreateDto,
    @Request() req: any,
  ): Promise<CategoriaOfertaDto> {
    return this.categoriaService.createCategoria(createCategoriaDto);
  }

  @Put(':id')
  //@UseGuards(JwtVerifiedGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async updateCategoria(
    @Param('id') id: number,
    @Body() updateCategoriaDto: CategoriaOfertaUpdateDto,
    @Request() req: any,
  ): Promise<CategoriaOfertaDto> {
    updateCategoriaDto.categoria_oferta_id = id;
    return this.categoriaService.updateCategoria(updateCategoriaDto);
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
    description: 'Categoría eliminada exitosamente',
    type: CategoriaOfertaDto
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
  ): Promise<CategoriaOfertaDto> {
    const username = usuario_modificacion; 
    return this.categoriaService.deleteCategoria(id, username);
  }
}