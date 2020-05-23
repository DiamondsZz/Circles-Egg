'use strict';

const Controller = require('egg').Controller;
const FS = require("fs");
const UUID = require("node-uuid");
class QuestionController extends Controller {
    //问题提交
    async ask() {
        let question = this.ctx.request.body;
        this.ctx.body = await this.service.question.askQuestions(question);
    }
    //获取问题详情
    async details() {
        let questionId = this.ctx.request.query.questionId;
        let userId = this.ctx.request.query.userId;
        this.ctx.body = await this.service.question.getQuestionDetails(questionId, userId);
    }
    //获取问题
    async get() {
        let type = this.ctx.request.query.type;
        this.ctx.body = await this.service.question.getQuestions(type);
    }
    //获取问题
    async getLastMonth() {
        let user = this.ctx.request.query.user;
        this.ctx.body = await this.service.question.getLastMonth(user);
    }
    //获取问题统计
    async getCount() {
        this.ctx.body = await this.service.question.getCount();
    }
    //获取问题
    async getSearch() {
        let search = this.ctx.request.body.search;
        this.ctx.body = await this.service.question.getQuestionsSearch(search);
    }
    //获取问题分类
    async getType() {
        let des = this.ctx.request.query.des;
        this.ctx.body = await this.service.question.getType(des);
    }
    //创建用户兴趣爱好
    async createInteresting() {
        let arg = this.ctx.request.body;
        this.ctx.body = await this.service.question.createInteresting(arg);
    }
    //获取用户兴趣爱好
    async getUserInteresting() {
        let user = this.ctx.request.query.user;
        this.ctx.body = await this.service.question.getUserInteresting(user);
    }
    //获取用户兴趣爱好分类
    async getInterestingType() {
        this.ctx.body = await this.service.question.getInterestingType();
    }
    //获取特定兴趣爱好用户
    async getInterestingUser() {
        let name = this.ctx.request.query.name;
        let fromUser = this.ctx.request.query.fromUser;
        this.ctx.body = await this.service.question.getInterestingUser(name, fromUser);
    }
    //获取相关问题
    async getQuestionRelative() {
        let type = this.ctx.request.body.type;
        let id = this.ctx.request.body.id;
        this.ctx.body = await this.service.question.getQuestionRelative(type, id);
    }
    //上传图片
    async imageUpload() {
        let info = await this.ctx.getFileStream();
        let imgNme = UUID.v4() + info.filename;
        let imgBufferArray = [];
        let imgSrc = "";  //返回给前端的图片路径
        imgSrc = await new Promise((resolve, reject) => {
            info.on("error", reject);
            info.on("data", (data) => {
                imgBufferArray.push(data)
            })
            info.on("end", () => {
                resolve(Buffer.concat(imgBufferArray))
            })
        }).then(async (data) => {
            let imgWrireStream = FS.createWriteStream(`app/public/ques/${imgNme}`)
            if (imgWrireStream.write(data)) {
                return `http://127.0.0.1:7001/public/ques/${imgNme}`
            }
        })
        this.ctx.body = imgSrc;

    }
}

module.exports = QuestionController;
