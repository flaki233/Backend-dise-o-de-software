import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OfertasService } from './ofertas.service';
import { CreateOfertaDto, UpdateOfertaDto, FilterOfertaDto } from './dtos';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { OfferStatus } from '@prisma/client';

@ApiTags('Ofertas')
@Controller('ofertas')
export class OfertasController {
  constructor(private readonly ofertasService: OfertasService) {}

  // ==================== RUTAS PÚBLICAS ====================

  @Get('public')
  @ApiOperation({ summary: 'Obtener todas las ofertas públicas (PUBLICADAS)' })
  @ApiQuery({ name: 'categoriaId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de ofertas públicas' })
  async findAllPublic(@Query() filters: FilterOfertaDto) {
    return this.ofertasService.findAllPublic(filters);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Obtener una oferta pública por ID' })
  @ApiParam({ name: 'id', description: 'ID de la oferta' })
  @ApiResponse({ status: 200, description: 'Oferta encontrada' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  async findOnePublic(@Param('id', ParseIntPipe) id: number) {
    return this.ofertasService.findOne(id);
  }

  // ==================== RUTAS PROTEGIDAS (Requieren JWT) ====================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva oferta (requiere autenticación)' })
  @ApiResponse({ status: 201, description: 'Oferta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 409, description: 'Ya existe una oferta con ese título' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser('userId') userId: number,
    @Body() createOfertaDto: CreateOfertaDto,
  ) {
    return this.ofertasService.create(userId, createOfertaDto);
  }

  @Get('my-offers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis ofertas (panel personal)' })
  @ApiQuery({ name: 'categoriaId', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OfferStatus })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de mis ofertas' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async findMyOffers(
    @GetUser('userId') userId: number,
    @Query() filters: FilterOfertaDto,
  ) {
    return this.ofertasService.findMyOffers(userId, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una oferta por ID (incluso si no está publicada, si eres el dueño)' })
  @ApiParam({ name: 'id', description: 'ID de la oferta' })
  @ApiResponse({ status: 200, description: 'Oferta encontrada' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  @ApiResponse({ status: 403, description: 'No tienes permiso para ver esta oferta' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.ofertasService.findOne(id, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una oferta (solo el propietario)' })
  @ApiParam({ name: 'id', description: 'ID de la oferta' })
  @ApiResponse({ status: 200, description: 'Oferta actualizada' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  @ApiResponse({ status: 403, description: 'No eres el propietario' })
  @ApiResponse({ status: 409, description: 'Ya existe otra oferta con ese título' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
    @Body() updateOfertaDto: UpdateOfertaDto,
  ) {
    return this.ofertasService.update(id, userId, updateOfertaDto);
  }

  @Patch(':id/status/:status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado de oferta: BORRADOR → PUBLICADA → PAUSADA' })
  @ApiParam({ name: 'id', description: 'ID de la oferta' })
  @ApiParam({ name: 'status', enum: OfferStatus, description: 'Nuevo estado' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  @ApiResponse({ status: 403, description: 'No eres el propietario' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: OfferStatus,
    @GetUser('userId') userId: number,
  ) {
    return this.ofertasService.updateStatus(id, userId, status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una oferta (solo el propietario)' })
  @ApiParam({ name: 'id', description: 'ID de la oferta' })
  @ApiResponse({ status: 200, description: 'Oferta eliminada' })
  @ApiResponse({ status: 404, description: 'Oferta no encontrada' })
  @ApiResponse({ status: 403, description: 'No eres el propietario' })
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.ofertasService.remove(id, userId);
  }
}

