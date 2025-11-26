import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
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
import { TypeSubQuestion } from '../enums/Type.enum';
import { Answer } from './answer.entity';
import { Question } from './question.entity';

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

  qualification?: number;
}
