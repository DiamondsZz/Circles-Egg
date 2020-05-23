'use strict';

const Controller = require('egg').Controller;

class FollowController extends Controller {
    //问题关注
    async followQuestion() {
        let follow = this.ctx.request.body;  
        this.ctx.body = await this.service.follow.followQuestion(follow)
    }
    //用户关注
    async followUser() {
        let user = this.ctx.request.body.user;  
        let fromUser = this.ctx.request.body.fromUser;  
        this.ctx.body = await this.service.follow.followUser(user,fromUser)
    }
    //用户信息
    async userGet() {
        let userId = this.ctx.request.body.userId;  
        let fromUserId = this.ctx.request.body.fromUser;  
        this.ctx.body = await this.service.follow.userGet(userId,fromUserId)
    }
}

module.exports = FollowController;
