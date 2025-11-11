import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Oferta } from './Oferta.entity';

@Entity({ name: 'imagen_oferta' })
export class ImagenOferta {
  @PrimaryGeneratedColumn({ type: 'int', name: 'imagen_oferta_id' })
  imagen_oferta_id: number;

  @ManyToOne(() => Oferta, { nullable: false })
  @JoinColumn({ name: 'oferta_id' })
  oferta: Oferta;

  @Column({ type: 'varchar', length: 55, nullable: false})
  imagen_oferta_nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: false})
  imagen_oferta_ruta: string;

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