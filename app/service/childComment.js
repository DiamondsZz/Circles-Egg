'use strict';

const Service = require('egg').Service;

class ChildCommentService extends Service {
  //用户提交评论的评论
  async publish(comment) {
    let res = await this.ctx.model.ChildComment.create(comment);
    return res;
  }
}

module.exports = ChildCommentService;
