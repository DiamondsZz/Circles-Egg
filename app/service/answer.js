'use strict';

const Service = require('egg').Service;
class AnswerService extends Service {
    //回答提交
    async writeAnswer(answer) {
        let res = await this.ctx.model.Answer.create(answer);
        return res;
    }
    //回答获取
    async getAnswer(id) {
        const Mongoose = this.app.mongoose;
        const ObjectId = Mongoose.Types.ObjectId;
        let res = await this.ctx.model.Answer.find({ questionId: id }).populate("user").exec();
        return res;
    }
    //热门回答获取
    async getHotAnswer() {
        let res = await this.ctx.model.Answer.find();
        let resType = new Set();  //回答类型
        let resMap = new Map();
        let resQuestion = [];   //排序后的问题


        //获取问题类型
        for (let type of res) {
            resType.add(type.questionId.toHexString())
        }
        //获取问题 回答对应的Map
        for (let type of resType) {
            let count = 0;
            for (let answer of res) {
                if (answer.questionId.toHexString() === type) {
                    count++;
                }
            }
            let question = await this.ctx.model.Question.findOne({ _id: type })
            resMap.set(question, count)
        }
        //对回答数量的值进行从大到小排序  并取出前五个
        let resMapValuesSorted = [...resMap.values()].sort((a, b) => {
            return b - a;
        }).slice(0, 5)
        //获取回答对应的问题
        for (let key of resMapValuesSorted) {
            for (let entry of resMap.entries()) {
                if (entry[1] === key) {
                    if (resQuestion.length > 0) {
                        //判断已有问题中是否存在该问题  (这里感觉会有异步问题)
                        let isPushQuestion = resQuestion.find((item) => {
                            return item._id.toHexString() === entry[0]._id.toHexString();
                        })
                        if (isPushQuestion === undefined) {
                            resQuestion.push(entry[0])
                            break;
                        }
                    } else {
                        resQuestion.push(entry[0])
                        break;
                    }
                }
            }
        }
        return {
            question: resQuestion,
            answer: resMapValuesSorted
        };
    }
    //邀请用户回答
    async inviteUser(id) {
        let res = await this.ctx.model.User.find();
        return res;
    }
}

module.exports = AnswerService;
