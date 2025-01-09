import { Injectable } from '@nestjs/common';
import { QuestionService } from 'src/question/question.service';
import { AnswerService } from 'src/answer/answer.service';

@Injectable()
export class StatService {
  // 依赖注入
  constructor(
    private readonly QuestionService: QuestionService,
    private readonly AnswerService: AnswerService,
  ) {}

  // 生成答卷信息 格式：{ componentFeId1: value1, componentFeId2: value2 }
  private _genAnswersInfo(answerList = []) {
    const res = {};

    answerList.forEach((a) => {
      const { componentFeId, value } = a;
      res[componentFeId] = value.toString();
    });

    return res;
  }

  // 获取单个问卷的答卷列表（分页）和数量
  async getQuestionStatListAndCount(
    questionId: string,
    opt: { page: number; pageSize: number },
  ) {
    const noData = { list: [], count: 0 };
    if (!questionId) return noData;

    // 判断该问卷有数据
    const q = await this.QuestionService.findOne(questionId);
    if (q == null) return noData;

    const total = await this.AnswerService.count(questionId);
    if (total === 0) return noData;

    const { page = 1, pageSize = 10 } = opt;
    const answers = await this.AnswerService.findAll(questionId, {
      page,
      pageSize,
    });

    const list = answers.map((a) => {
      return {
        _id: a._id,
        ...this._genAnswersInfo(a.answerList),
      };
    });
    return { list, total };
  }
}
