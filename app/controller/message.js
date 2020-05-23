'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {
  //消息生成
  async messageCreate() {
    let message = this.ctx.request.body;
    this.ctx.body = await this.service.message.messageCreate(message)
  }
  //消息获取
  async messageGet() {
    let id = this.ctx.request.query.id;
    this.ctx.body = await this.service.message.messageGet(id)
  }
  //消息获取
  async messageAllGet() {
    let id = this.ctx.request.query.id;
    this.ctx.body = await this.service.message.messageAllGet(id)
  }
   //消息获取
   async messageAllUserGet() {
    let id = this.ctx.request.query.id;
    this.ctx.body = await this.service.message.messageAllUserGet(id)
  }
  //消息查看
  async messageLook() {
    let message = this.ctx.request.body.message;
    this.ctx.body = await this.service.message.messageLook(message)
  }

}

module.exports = MessageController;
