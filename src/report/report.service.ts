import { Injectable } from '@nestjs/common';

import { ReportType, data } from 'src/data';
import { v4 as uuid } from 'uuid';
import { ReportReponseDto } from 'src/dto/report.dto';

interface ReportData {
  amount: number;
  source: string;
}

interface UpdateReport {
  amount?: number;
  source?: string;
}

@Injectable()
export class ReportService {
  getAllReports(type: ReportType): ReportReponseDto[] {
    return data.report
      .filter((report) => report.type === type)
      .map((report) => new ReportReponseDto(report));
  }
  getReportById(type: ReportType, id: string): ReportReponseDto {
    const report = data.report
      .filter((report) => report.type === type)
      .find((report) => report.id === id);

    if (!report) return;

    return new ReportReponseDto(report);
  }
  createReport(
    type: ReportType,
    { amount, source }: ReportData,
  ): ReportReponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    const newReport = {
      id: uuid(),
      source,
      amount,
      created_at: new Date(),
      updated_at: new Date(),
      type: reportType,
    };
    data.report.push(newReport);
    return new ReportReponseDto(newReport);
  }
  updateReport(
    type: ReportType,
    id: string,
    body: UpdateReport,
  ): ReportReponseDto {
    const reportType =
      type === 'income' ? ReportType.INCOME : ReportType.EXPENSE;
    const reportToUpdate = data.report
      .filter((report) => report.type === reportType)
      .find((report) => report.id === id);

    if (!reportToUpdate) return;

    const reportIndex = data.report.findIndex((report) => report.id === id);
    data.report[reportIndex] = {
      ...data.report[reportIndex],
      ...body,
      updated_at: new Date(),
    };

    return new ReportReponseDto(data.report[reportIndex]);
  }
  deleteReport(id: string) {
    const reportIndex = data.report.findIndex((report) => report.id === id);

    if (reportIndex === -1) return;

    data.report.splice(reportIndex, 1);

    return;
  }
}
