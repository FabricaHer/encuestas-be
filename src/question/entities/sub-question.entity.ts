import { Answer } from './answer.entity';
import { TypeSubQuestion } from '../enums/Type.enum';
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
import { Question } from './question.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity({ name: 'sub_question' })
export class SubQuestion {
  @Exclude()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsNotEmpty()
  @Column({ type: 'varchar' })
  description: string;

  @IsOptional()
  @Column({ type: 'boolean', default: true })
  status: boolean;

  @IsOptional()
  @Column({ type: 'boolean', default: true })
  isAvailableForReport: boolean;

  @IsOptional()
  @Column({
    type: 'enum',
    enum: TypeSubQuestion,
    default: TypeSubQuestion.DEFAULT,
  })
  type: TypeSubQuestion;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @IsOptional()
  @OneToMany(() => Answer, (answer) => answer.subQuestion)
  answers: Answer[];
}
