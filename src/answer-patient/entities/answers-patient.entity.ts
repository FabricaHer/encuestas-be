import { Answer } from '../../question/entities/answer.entity';
import { SubQuestion } from '../../question/entities/sub-question.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswerPatient } from './answer-patient.entity';

@Entity({ name: 'answers_patient' })
export class AnswersPatient {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'integer' })
  qualification: number;

  @ManyToOne(() => SubQuestion)
  @JoinColumn({ name: 'sub_question_id' })
  subQuestion: SubQuestion;

  @ManyToOne(() => Answer)
  @JoinColumn({ name: 'answer_id' })
  answer: Answer;

  @ManyToOne(() => AnswerPatient)
  @JoinColumn({ name: 'answer_patient_id' })
  answerPatient: AnswerPatient;

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
