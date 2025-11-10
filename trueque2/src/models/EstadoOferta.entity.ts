import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'estado_oferta' })
export class EstadoOferta {
  @PrimaryGeneratedColumn({ type: 'int', name: 'estado_oferta_id' })
  estado_oferta_id: number;

  @Column({ type: 'varchar', length: 55, nullable: false})
  estado_oferta_nombre: string;

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