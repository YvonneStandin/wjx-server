import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  // 依赖注入
  constructor(private readonly QuestionService: QuestionService) {}
  // 模拟错误
  @Get('test')
  getTest(): string {
    throw new HttpException('模拟数据失败', HttpStatus.BAD_REQUEST);
  }

  @Post()
  create() {
    return this.QuestionService.create();
  }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const list = await this.QuestionService.findAllList({
      keyword,
      page,
      pageSize,
    });

    const count = await this.QuestionService.countAll({ keyword });

    return {
      list,
      count,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.QuestionService.findOne(id);
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.QuestionService.delete(id);
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    return this.QuestionService.update(id, questionDto);
  }
}
