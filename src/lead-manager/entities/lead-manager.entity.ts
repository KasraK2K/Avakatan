import { LeadEntity } from 'src/lead/entities/lead.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('lead_managers')
@Unique(['name'])
export class LeadManagerEntity extends BaseEntity {
  /* -------------------------------------------------------------------------- */
  /*                                   Columns                                  */
  /* -------------------------------------------------------------------------- */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('increment')
  no: number;

  @Column()
  name: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updated_at: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  deleted_at: Date;

  @VersionColumn()
  version: number;

  /* -------------------------------------------------------------------------- */
  /*                                  Relations                                 */
  /* -------------------------------------------------------------------------- */
  @OneToOne(type => LeadEntity, leadEntity => leadEntity.lead_manager, {
    eager: true,
  })
  lead: LeadEntity;
}
