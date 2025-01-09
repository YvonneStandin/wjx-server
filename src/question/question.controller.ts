import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { QuestionService } from './question.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('question')
export class QuestionController {
  // 依赖注入
  constructor(private readonly QuestionService: QuestionService) {}

  // 创建问卷
  // C 端创建答卷时需要获取，不需要身份校验
  @Post()
  create(@Request() req) {
    const { username } = req.user;
    return this.QuestionService.create(username);
  }

  // 获取问卷列表兼问卷数量
  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('isStar') isStar: boolean = false,
    @Query('isDeleted') isDeleted: boolean = false,
    @Request() req,
  ) {
    const { username } = req.user;
    const list = await this.QuestionService.findAllList({
      keyword,
      page,
      pageSize,
      isStar,
      isDeleted,
      author: username,
    });

    const count = await this.QuestionService.countAll({
      keyword,
      isStar,
      isDeleted,
      author: username,
    });

    return {
      list,
      count,
    };
  }

  // 查询单个问卷信息
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.QuestionService.findOne(id);
  }

  // 删除单个问卷
  @Delete(':id')
  deleteOne(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.QuestionService.delete(id, username);
  }

  // 删除多个问卷
  @Delete()
  deleteMany(@Body() body, @Request() req) {
    const { ids = [] } = body;
    const { username } = req.user;
    return this.QuestionService.deleteMany(ids, username);
  }

  // 更新问卷
  @Patch(':id')
  updateOne(
    @Param('id') id: string,
    @Body() questionDto: QuestionDto,
    @Request() req,
  ) {
    const { username } = req.user;
    return this.QuestionService.update(id, questionDto, username);
  }

  // 复制问卷
  @Post('duplicate/:id')
  duplicate(@Param('id') id: string, @Request() req) {
    const { username } = req.user;
    return this.QuestionService.duplicate(id, username);
  }
}
