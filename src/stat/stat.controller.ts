import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatService } from './stat.service';

@Controller('stat')
export class StatController {
  constructor(private readonly StatService: StatService) {}

  @Get(':questionID')
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
}
