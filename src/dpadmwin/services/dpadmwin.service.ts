import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserModel } from '../models/user.model';
@Injectable()
export class DpadmwinService {
  constructor(private readonly dataSource: DataSource) {}

  findAllBed() {
    return this.dataSource
      .query(`SELECT CAM_DSCRIP AS nombre, CAM_CODIGO AS codigo 
    FROM DPADMWIN.TBCAMAS 
    WHERE CAM_CODSUC = '000001' AND CAM_EDO = '1' ORDER BY CAM_DSCRIP`);
  }

  async findPatientList() {
    const list = await this.dataSource.query(`SELECT
    SEC_DSCRIP as area_description,
      CAM_CODIGO  AS id_bed,
      CAM_DSCRIP as bed_description,
      CONCAT(PAC_NOM, ' ', PAC_APELL) AS patient,
      PAC_SEXO as gender,
      DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(PAC_FNAC, '%Y') AS age,
      PAC_CED as id_patient,
      DOC_NUMERO as admission,
      CLI_NOMBRE as client,
      format_id
      FROM
      DPADMWIN.DPDOCCLI
      LEFT JOIN DPADMWIN.TBCAMPOSADICCLI
        ON (
          DPADMWIN.TBCAMPOSADICCLI.CAD_CODSUC = DPADMWIN.DPDOCCLI.DOC_CODSUC
        )
        AND (
          DPADMWIN.TBCAMPOSADICCLI.CAD_TIPO = DPADMWIN.DPDOCCLI.DOC_TIPDOC
        )
        AND (
          DPADMWIN.TBCAMPOSADICCLI.CAD_NUMERO = DPADMWIN.DPDOCCLI.DOC_NUMERO
        )
      LEFT JOIN DPADMWIN.TBCAMAS
        ON DPADMWIN.TBCAMPOSADICCLI.CAD_UBIPAC = DPADMWIN.TBCAMAS.CAM_CODIGO
      LEFT JOIN DPADMWIN.TBPACIENTE
        ON DPADMWIN.DPDOCCLI.DOC_CEDPAC = DPADMWIN.TBPACIENTE.PAC_CED
      LEFT JOIN DPADMWIN.DPCLIENTES
        ON DPADMWIN.DPDOCCLI.DOC_CODIGO = DPADMWIN.DPCLIENTES.CLI_CODIGO
      LEFT JOIN DPADMWIN.DPMEMO
        ON DPADMWIN.DPDOCCLI.DOC_NUMMEM = DPADMWIN.DPMEMO.MEM_NUMERO
      INNER JOIN DPADMWIN.TBSECCIONES
        ON DPADMWIN.TBCAMAS.CAM_CODSEC = DPADMWIN.TBSECCIONES.SEC_CODIGO
      INNER JOIN DPADMWIN.TBPABELLON
        ON DPADMWIN.TBSECCIONES.SEC_CODPAB = DPADMWIN.TBPABELLON.PAB_CODIGO
      LEFT JOIN ENCUESTAS.answer_patient 
      ON  ENCUESTAS.answer_patient.admission_id = DPADMWIN.DPDOCCLI.DOC_NUMERO 
      AND ENCUESTAS.answer_patient.patient_id = DPADMWIN.DPDOCCLI.DOC_CEDPAC  
      AND ENCUESTAS.answer_patient.deleted_at IS NULL
  
    WHERE (
        DOC_ESTADO = 'AC'
        OR DOC_ESTADO = 'CE'
        OR DOC_ESTADO = 'CI'
        OR DOC_ESTADO = 'PR'
      )
      AND DOC_TIPDOC = 'ADM'
      AND DOC_CODSUC = '000001'
      AND TBCAMAS.CAM_CODIGO NOT IN('063','120')
    ORDER BY CAM_CODIGO,
      DOC_NUMERO`);

    const newList = list.reduce((groupedData, item) => {
      const { area_description, ...rest } = item;
      (
        groupedData[area_description] || (groupedData[area_description] = [])
      ).push(rest);
      return groupedData;
    }, {});

    // Convertimos el objeto agrupado a un arreglo de objetos con la estructura deseada
    const result = Object.entries(newList).map(
      ([area_description, patients]) => ({
        area_description,
        patients,
      }),
    );

    return result;
  }

  async getAdmission(admission_id: string) {
    return this.dataSource.query(
      `SELECT CONCAT(PAC.PAC_NOM, ' ',PAC.PAC_APELL) AS name, PAC.PAC_CED AS id_patient, DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(PAC_FNAC, '%Y') AS age,
    PAC.PAC_SEXO AS gender, PAC.PAC_TELEF1 AS phone,DP.DOC_NUMERO AS admission, TBCAMPOSADICCLI.CAD_UBIPAC AS bed_id
    FROM DPADMWIN.DPDOCCLI AS DP
    INNER JOIN DPADMWIN.TBPACIENTE AS PAC ON PAC.PAC_CED = DP.DOC_CEDPAC
    INNER JOIN DPADMWIN.TBCAMPOSADICCLI AS TBCAMPOSADICCLI 
    ON TBCAMPOSADICCLI.CAD_NUMERO = DP.DOC_NUMERO 
    AND TBCAMPOSADICCLI.CAD_TIPO = DP.DOC_TIPDOC 
    AND TBCAMPOSADICCLI.CAD_CODSUC = DP.DOC_CODSUC
    WHERE DP.DOC_NUMERO = '${admission_id}' AND DP.DOC_TIPDOC = 'ADM'`,
    );
  }

  async getUser(username: string): Promise<UserModel | null> {
    const user = (await this.dataSource.query(
      `SELECT OPE_NUMERO AS id, OPE_NOMBRE AS username, OPE_CLAVE AS password,OPE_MAPMNU AS role,OPE_NOMCOM AS name 
      FROM ADMCONFIG.DPUSUARIOS WHERE OPE_NOMBRE = '${username}'`,
    )) as UserModel[];
    if (user.length <= 0) return null;

    return user[0];
  }
}
