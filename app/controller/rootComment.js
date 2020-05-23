'use strict';

const Controller = require('egg').Controller;

class RootCommentController extends Controller {
  //用户提交回答评论
  async publish() {
    let comment = this.ctx.request.body;
    this.ctx.body = await this.service.rootComment.publish(comment);
  }

  //获取评论
  async get() {
    let id = this.ctx.request.query.id;
    let currentPage=this.ctx.request.query.currentPage;
    this.ctx.body = await this.service.rootComment.get(id,currentPage);
  }
}

module.exports = RootCommentController;

