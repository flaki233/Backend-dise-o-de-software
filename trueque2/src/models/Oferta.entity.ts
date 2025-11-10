import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaOferta } from './CategoriaOferta.entity';
import { EstadoOferta } from './EstadoOferta.entity';

@Entity({ name: 'oferta' })
export class Oferta {
  @PrimaryGeneratedColumn({ type: 'int', name: 'oferta_id' })
  oferta_id: number;

  @ManyToOne(() => CategoriaOferta, { nullable: false })
  @JoinColumn({ name: 'categoria_oferta_id' })
  categoriaOferta: CategoriaOferta;
  
  @ManyToOne(() => EstadoOferta, { nullable: false })
  @JoinColumn({ name: 'estado_oferta_id' })
  estadoOferta: EstadoOferta;

  @Column({ type: 'varchar', length: 255, nullable: false})
  oferta_titulo: string;

  @Column({ type: 'varchar', length: 255, nullable: false})
  oferta_condicion_trueque: string;

  @Column({ type: 'varchar', length: 255, nullable: false})
  oferta_comentario_obligatorio: string;


  @Column({ type: 'double precision', nullable: false})
  oferta_latitud: number;

  @Column({ type: 'double precision', nullable: false})
  oferta_longitud: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  usuario_creacion: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_creacion: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  usuario_modificacion: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_modificacion: Date;

  @Column({ type: 'smallint', nullable: true })
  estado_registro: number;
}