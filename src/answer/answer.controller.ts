import { Controller, Post, Body } from '@nestjs/common';
import { AnswerService } from './answer.service';

@Controller('answer')
export class AnswerController {
  constructor(private readonly AnswerService: AnswerService) {}

  // 创建答卷
  @Post()
  async create(@Body() body) {
    return await this.AnswerService.create(body);
  }
}
