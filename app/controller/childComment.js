'use strict';

const Controller = require('egg').Controller;

class ChildCommentController extends Controller {
  //用户提交评论的评论
  async publish() {
    let comment = this.ctx.request.body;
    console.log(comment);  
    this.ctx.body = await this.service.childComment.publish(comment);
  }
}

module.exports = ChildCommentController;

