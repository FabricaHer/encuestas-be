import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Format } from '../../format/entities/format.entity';
import { Area } from '../../area/entities/area.entity';
import { SubQuestion } from './sub-question.entity';

@Entity({ name: 'question' })
export class Question {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Format, (format) => format.questions)
  @JoinColumn({ name: 'format_id' })
  format: Format;

  @ManyToOne(() => Area, (area) => area.question, { nullable: true })
  @JoinColumn({ name: 'area_id' })
  area: Area;

  @OneToMany(() => SubQuestion, (subQuestion) => subQuestion.question)
  subQuestion: SubQuestion[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt?: Date;
}
