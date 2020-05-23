'use strict';

const Controller = require('egg').Controller;

class IndexController extends Controller {
  //获取已回答问题数据
  async index() {
    let type = this.ctx.request.body.type
    let user = this.ctx.request.body.user
    let isHot = this.ctx.request.body.isHot
    if (isHot) {
      this.ctx.body = await this.service.question.getHot();
    } else {
      this.ctx.body = await this.service.question.getQuestionsAlready(type, user);

    }

  }
}

module.exports = IndexController;

