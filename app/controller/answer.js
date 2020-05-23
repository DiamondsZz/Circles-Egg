'use strict';

const Controller = require('egg').Controller;

class AnswerController extends Controller {
    //回答提交
    async write() {
        let answer = this.ctx.request.body;
        this.ctx.body = await this.service.answer.writeAnswer(answer)
    }
    //回答获取
    async get() {
        let id = this.ctx.request.query.questionId;
        this.ctx.body = await this.service.answer.getAnswer(id);
    }
    //回答获取
    async getHot() {
        this.ctx.body = await this.service.answer.getHotAnswer();
    }
    //邀请回答
    async invite() {
        let id = this.ctx.request.query.questionId;
        this.ctx.body = await this.service.answer.inviteUser(id);
    }
}

module.exports = AnswerController;
