'use strict';

const Service = require('egg').Service;
class FollowService extends Service {
    //回答关注
    async followQuestion(follow) {
        let resFollow = await this.ctx.model.Follow.findOne({ question: follow.question, user: follow.user });
        let res;
        if (!!resFollow) {
            await this.ctx.model.Follow.findOneAndUpdate({ '_id': resFollow._id }, { 'isFollow': !resFollow.isFollow }, { new: true }, (err, r) => {
                if (!err) {
                    res = r
                } else {
                    res = "关注失败"
                }
            })
        } else {
            res = await this.ctx.model.Follow.create(follow);
        }
        return res;
    }
    //用户关注
    async followUser(user, fromUser) {
        let resFollow = await this.ctx.model.FollowUser.findOne({ user, fromUser });
        let res;
        if (!!resFollow) {
            await this.ctx.model.FollowUser.findOneAndUpdate({ '_id': resFollow._id }, { 'isFollow': !resFollow.isFollow }, { new: true }, (err, r) => {
                if (!err) {
                    res = r
                } else {
                    res = "关注失败"
                }
            })
        } else {
            res = await this.ctx.model.FollowUser.create({ user, fromUser });
        }
        return res;
    }

    async userGet(user, fromUser) {
        //该用户回答的问题数量
        let resAnswer = await this.ctx.model.Answer.find({ user });
        //该用户发表的文章数量
        let resQuestion = await this.ctx.model.Question.find({ user });
        //该用户的关注者数量
        let resFollow = await this.ctx.model.FollowUser.find({ user, isFollow: true });
        //该用户是否被当前用户关注
        let resIsFollow = await this.ctx.model.FollowUser.findOne({ user, fromUser });
        return {
            answerCount: resAnswer.length,
            questionCount: resQuestion.length,
            followCount: resFollow.length,
            isFollow: resIsFollow ? resIsFollow.isFollow : false
        }
    }
}

module.exports = FollowService;
