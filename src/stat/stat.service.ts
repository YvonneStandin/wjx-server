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
    // 未传questionId
    const noData = { list: [], count: 0 };
    if (!questionId) return noData;

    // 判断该问卷存在
    // 该判断应该也不用，如果问卷不存在，total 应为 0 ，下面的判断也能兜住
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
        _id: a._id, // 不用挂 id 也行吧，因为本就是通过 questionId 获取的数据
        ...this._genAnswersInfo(a.answerList), // { componentId1: value1, componentId2: value2 }
      };
    });
    return { list, total };
  }

  // 获取单个组件的统计数据
  async getComponentStat(questionId: string, componentFeId: string) {
    if (!questionId || !componentFeId) return [];

    // 获取问卷
    const q = await this.QuestionService.findOne(questionId);
    if (q == null) return [];

    // 获取组件
    const { componentList = [] } = q;
    const comp = componentList.filter((c) => c.fe_id === componentFeId)[0];
    if (comp == null) return [];

    const { type } = comp;
    // 非单选和多选的组件不统计
    if (type !== 'questionRadio' && type !== 'questionCheckbox') return [];

    // 获取答卷列表
    const total = await this.AnswerService.count(questionId);
    if (total === 0) return [];

    // 获取该问卷的所有答卷（不分页）
    const answers = await this.AnswerService.findAll(questionId, {
      page: 1,
      pageSize: total,
    });

    // 累加数量 { value1: count1, value2: count2 }
    const countInfo = {};
    answers.forEach((a) => {
      const { answerList = [] } = a;
      answerList.forEach((a) => {
        if (a.componentFeId !== componentFeId) return;
        a.value.forEach((v) => {
          if (countInfo[v] == null) countInfo[v] = 0;
          countInfo[v]++;
        });
      });
    });

    // 整理数据 [{ name: value1, count: count1 }, { name: value2, count: count2 }]
    const list = [];
    for (const val in countInfo) {
      list.push({ name: val, count: countInfo[val] });
    }
    return list;
  }
}
