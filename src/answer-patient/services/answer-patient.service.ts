import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaService } from 'src/area/services/area.service';
import { FormatService } from 'src/format/services/format.service';
import { SubQuestionService } from 'src/question/services/sub-question.service';
import { Between, Repository } from 'typeorm';
import { CreateAnswerPatientDto } from '../dto/create-answer-patient.dto';
import { UpdateAnswerPatientDto } from '../dto/update-answer-patient.dto';
import { AnswerPatient } from '../entities/answer-patient.entity';
import { AnswersPatient } from '../entities/answers-patient.entity';
import { Comment } from '../entities/comment.entity';
import * as moment from 'moment';

@Injectable()
export class AnswerPatientService {
  constructor(
    @InjectRepository(AnswerPatient)
    private readonly answerPatientRepo: Repository<AnswerPatient>,
    @InjectRepository(AnswersPatient)
    private readonly answersPatientRepo: Repository<AnswersPatient>,
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly formatService: FormatService,
    private readonly subQuestionService: SubQuestionService,
    private readonly areaService: AreaService,
  ) {}
  async create(createAnswerPatientDto: CreateAnswerPatientDto) {
    const format = await this.formatService.findOne(
      createAnswerPatientDto.format,
    );

    if (!format) {
      throw new BadRequestException('Formato no encontrado');
    }

    const answerPatientCreated = await this.answerPatientRepo.save({
      admissionId: createAnswerPatientDto.admissionId,
      bedId: createAnswerPatientDto.bedId,
      format,
      patientId: createAnswerPatientDto.patientId,
    });

    await this.commentRepo.save({
      description: createAnswerPatientDto.comment,
      answerPatient: answerPatientCreated,
    });
    if (createAnswerPatientDto.answers.length > 0) {
      const promise = createAnswerPatientDto.answers.map(
        async (answerPatient) => {
          const subQuestion = await this.subQuestionService.findOne(
            answerPatient.subQuestion,
          );
          return this.answersPatientRepo.create({
            subQuestion,
            qualification: answerPatient.qualification,
            answerPatient: answerPatientCreated,
          });
        },
      );

      const arrayAnswers = await Promise.all(promise);

      await this.answersPatientRepo.save(arrayAnswers);
    }
  }

  async dataChart(startDate: Date, endDate: Date) {
    const newEndDate = moment(endDate)
      .add(23, 'hour')
      .add(59, 'minute')
      .add(59, 'second')
      .toDate();
    let newStartDate = new Date(startDate);

    const data: {}[] = [];
    const areas = await this.areaService.find();

    const map = new Map<
      string,
      Map<string, { qualifications: number; total: number }>
    >();

    while (newStartDate <= newEndDate) {
      const dateString = newStartDate.toISOString().split('T')[0];
      map.set(dateString, new Map());
      newStartDate.setDate(newStartDate.getDate() + 1);
    }
    newStartDate = new Date(startDate);

    const answers = await this.answersPatientRepo.find({
      where: {
        createdAt: Between(newStartDate, newEndDate),
        subQuestion: {
          question: {
            area: {
              status: true,
            },
          },
        },
      },
      relations: {
        subQuestion: {
          question: {
            area: true,
          },
        },
      },
    });
    answers.forEach((answer, i) => {
      const dateString = answer.createdAt.toISOString().split('T')[0];
      const dataString = map.get(dateString);

      if (dataString.has(answer.subQuestion.question.area.description)) {
        let data = dataString.get(answer.subQuestion.question.area.description);
        data.qualifications += answer.qualification;
        data.total += 1;
        dataString.set(answer.subQuestion.question.area.description, {
          qualifications: data.qualifications,
          total: data.total,
        });
      } else {
        const areaMap = new Map<
          string,
          { qualifications: number; total: number }
        >();
        areas.forEach((area) => {
          areaMap.set(area.description, { qualifications: 0, total: 0 });
        });

        areaMap.set(answer.subQuestion.question.area.description, {
          qualifications: answer.qualification,
          total: 1,
        });

        map.set(dateString, areaMap);
      }
    });

    while (newStartDate <= newEndDate) {
      const dateString = newStartDate.toISOString().split('T')[0];
      let values: { date: string } = { date: dateString };

      areas.forEach((area) => {
        values = {
          ...values,
          [area.description]: 0,
        };
      });

      const keys = map.get(dateString);
      keys.forEach(({ qualifications, total }, key) => {
        values = {
          ...values,
          [key]: (total ? qualifications / total : 0).toFixed(2),
        };
      });
      data.push(values);
      newStartDate.setDate(newStartDate.getDate() + 1);
    }

    return data;
  }

  getTotalAnswer(startDate: Date, endDate: Date): Promise<number> {
    const newEndDate = moment(endDate).add(1, 'days').toDate();
    return this.answerPatientRepo.count({
      where: {
        createdAt: Between(startDate, newEndDate),
        status: true,
      },
    });
  }

  async getAverage(
    startDate: Date,
    endDate: Date,
  ): Promise<{ average: number; description: string }[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const data: { average: number; description: string }[] =
      await this.answerPatientRepo.query(
        `SELECT AVG(qualification) AS average, area.description AS description FROM answers_patient
    INNER JOIN sub_question ON sub_question.id = answers_patient.sub_question_id
    INNER JOIN question ON question.id = sub_question.question_id
    INNER JOIN area ON area.id = question.area_id
    WHERE  DATE(answers_patient.created_at) BETWEEN '${start}' AND '${end}' and area.status = '1'
    GROUP BY area.id`,
      );
    return data;
  }

  async getLastAnswer(
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: Date; id: number; bed: string; name: string }[]> {
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    const lastAnswers: { date: Date; id: number; bed: string; name: string }[] =
      await this.answerPatientRepo.query(`
    SELECT created_at AS date, id, CAM_DSCRIP AS bed, CONCAT(PAC_NOM,' ',PAC_APELL) AS name FROM answer_patient AS answer
    INNER JOIN DPADMWIN.TBCAMAS AS cama ON cama.CAM_CODIGO = answer.bed_id
    INNER JOIN DPADMWIN.TBPACIENTE AS pac ON pac.PAC_CED = answer.patient_id
    WHERE DATE(created_at) BETWEEN '${start}' AND '${end}'
     ORDER BY created_at DESC LIMIT 4`);

    return lastAnswers;
  }

  findOne(id: number) {
    return `This action returns a #${id} answerPatient`;
  }

  update(id: number, updateAnswerPatientDto: UpdateAnswerPatientDto) {
    return `This action updates a #${id} answerPatient`;
  }

  remove(id: number) {
    return `This action removes a #${id} answerPatient`;
  }
}
