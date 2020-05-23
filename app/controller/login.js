'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
    //用户登录
    async login() {
        let user = this.ctx.request.body;
        this.ctx.body = await this.service.login.login(user)
    }
}

module.exports = LoginController;
