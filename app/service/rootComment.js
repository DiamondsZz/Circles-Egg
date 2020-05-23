'use strict';

const Service = require('egg').Service;

class RootCommentService extends Service {


  //用户提交回答评论
  async publish(comment) { 
    let res = await this.ctx.model.RootComment.create(comment);
    if(!!res)
    {
       let updateRes = await this.ctx.model.Answer.update({ '_id': comment.answerId }, { $inc: { 'commentCount': 1 } })
    }
   
    return res;
  }


  //获取用户评论
  async get(id,currentPage) {
    const ObjectId = this.app.mongoose.Types.ObjectId;
    let resRoot = await this.ctx.model.RootComment.find({ answerId: id }).limit(4).skip((currentPage-1)*4).populate("user").exec();
    let res = await Promise.all(resRoot.map(async (root) => {
      let resChild = await this.ctx.model.ChildComment.find({ commentId: root._id }).populate("user").populate("userCommented").exec();
      let comment = JSON.parse(JSON.stringify(root));
      comment.child = resChild;
      return comment;
    }))
    return res;
  }

}

module.exports = RootCommentService;
