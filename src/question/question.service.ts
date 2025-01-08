import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schemas/question.schema';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(
    // 依赖注入
    @InjectModel(Question.name) private readonly questionModel,
  ) {}

  // 新建问卷
  async create(username: string) {
    const question = new this.questionModel({
      title: '问卷标题' + Date.now(),
      desc: '问卷描述',
      author: username,
      componentList: [
        {
          fe_id: nanoid(),
          type: 'questionInfo',
          title: '问卷信息',
          props: { title: '问卷标题', desc: '问卷描述...' },
        },
      ],
    });
    return await question.save();
  }

  // 删除单个问卷
  async delete(id: string, author: string) {
    // return await this.questionModel.findByIdAndDelete(id, author);
    const res = await this.questionModel.findOneAndDelete({
      _id: id,
      author,
    });

    return res;
  }

  // 删除多个问卷
  async deleteMany(ids: string[], author: string) {
    const res = await this.questionModel.deleteMany({
      _id: { $in: ids }, // 在 ids 范围内的 id 都删除
      author,
    });

    return res;
  }

  // 更新问卷
  async update(id: string, updateData, author) {
    return await this.questionModel.updateOne({ _id: id, author }, updateData);
  }

  // 查询单个问卷信息
  async findOne(id: string) {
    return await this.questionModel.findById(id);
  }

  // 获取问卷列表
  async findAllList({
    keyword = '',
    page = 1,
    pageSize = 10,
    isStar,
    isDeleted,
    author = '',
  }) {
    const whereOpt: any = {
      author,
      isDeleted,
    };
    if (isStar != null) {
      whereOpt.isStar = isStar;
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; // 模糊搜索
    }
    return await this.questionModel
      .find(whereOpt)
      .sort({ _id: -1 }) // 逆序排序
      .skip((page - 1) * pageSize) // 分页（例如第2页，则跳过前10条）
      .limit(pageSize); // 限制取10条
  }

  // 获取问卷数量
  async countAll({ keyword = '', isStar, isDeleted, author = '' }) {
    const whereOpt: any = { author, isDeleted };
    if (isStar != null) {
      whereOpt.isStar = isStar;
    }
    if (keyword) {
      const reg = new RegExp(keyword, 'i');
      whereOpt.title = { $regex: reg }; // 模糊搜索
    }
    return await this.questionModel.countDocuments(whereOpt);
  }

  // 复制问卷
  async duplicate(id: string, author: string) {
    const question = await this.questionModel.findById(id);
    const newQuestion = new this.questionModel({
      ...question.toObject(),
      _id: new mongoose.Types.ObjectId(), // 生成新的 mongodb 格式的 id
      title: question.title + ' 副本',
      author,
      isPublished: false,
      isStar: false,
      componentList: question.componentList.map((item) => {
        return {
          ...item,
          fe_id: nanoid(), // 生成新的组件 id
        };
      }),
    });
    return await newQuestion.save();
  }
}
