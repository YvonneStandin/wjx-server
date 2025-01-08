import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Answer } from './schema/answer.schema';

@Injectable()
export class AnswerService {
  // 依赖注入
  constructor(@InjectModel(Answer.name) private readonly AnswerModel) {}

  // 创建答卷
  async create(answerInfo) {
    if (answerInfo.questionId == null) {
      throw new HttpException('缺少问卷 id', HttpStatus.BAD_REQUEST);
    }

    const answer = new this.AnswerModel(answerInfo);
    return await answer.save();
  }
}
