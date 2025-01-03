import {
  Controller,
  Get,
  Patch,
  Query,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
  // 模拟错误
  @Get('test')
  getTest(): string {
    throw new HttpException('模拟数据失败', HttpStatus.BAD_REQUEST);
  }

  @Get()
  findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    console.log(keyword, page, pageSize);
    return {
      list: ['a', 'b'],
      count: 13,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return {
      id,
      title: 'sss',
      desc: 'hhh',
    };
  }

  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() questionDto: QuestionDto) {
    console.log(questionDto);
    return {
      id,
      title: 'sss',
      desc: 'hhh',
    };
  }
}
