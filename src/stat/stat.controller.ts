import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly StatService: StatService) {}

  @Get(':questionId')
  async getQuestionStat(
    @Param('questionId') questionId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.StatService.getQuestionStatListAndCount(questionId, {
      page,
      pageSize,
    });
  }

  @Get(':questionId/:componentFeId')
  async getComponentStat(
    @Param('questionId') questionId: string,
    @Param('componentFeId') componentFeId: string,
  ) {
    const stat = await this.StatService.getComponentStat(
      questionId,
      componentFeId,
    );
    return { stat };
  }
}
