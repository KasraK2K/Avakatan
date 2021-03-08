import { LeadManagerEntity } from 'src/lead-manager/entities/lead-manager.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('leads')
@Unique(['email'])
@Unique(['cellphone'])
export class LeadEntity extends BaseEntity {
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

  @Column()
  family_name: string;

  @Column()
  email: string;

  @Column()
  cellphone: string;

  @Column({ nullable: true })
  interest: boolean;

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
  @OneToOne(
    type => LeadManagerEntity,
    leadManagerEntity => leadManagerEntity.lead,
  )
  @JoinColumn()
  lead_manager: LeadManagerEntity;
}
