import { Format } from '../../format/entities/format.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnswersPatient } from './answers-patient.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'answer_patient' })
export class AnswerPatient {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', name: 'bed_id' })
  bedId: string;

  @Column({ type: 'varchar', name: 'patient_id' })
  patientId: string;

  @Column({ type: 'varchar', name: 'admission_id', unique: true })
  admissionId: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Format)
  @JoinColumn({ name: 'format_id' })
  format: Format;

  @OneToMany(
    () => AnswersPatient,
    (answersPatient) => answersPatient.answerPatient,
  )
  answersPatient: AnswersPatient[];

  @OneToOne(() => Comment, (comment) => comment.answerPatient)
  comment: Comment;

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
