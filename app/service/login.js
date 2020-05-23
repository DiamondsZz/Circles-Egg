'use strict';

const Service = require('egg').Service;
class LoginService extends Service {
    //用户登录
    async login(user) {
        let resPhone = await this.ctx.model.User.find({ phone: user.phone });
        if (resPhone.length === 0) {
            let resUser = await this.ctx.model.User.create({ phone: user.phone, password: user.password });
            return {
                user: resUser,
                code: 1
            };

        } else {
            let res = await this.ctx.model.User.find({ phone: user.phone, password: user.password });
            if (res.length === 0) {
                return {
                    code: -1
                }
            } else {
                return {
                    user: res[0],
                    code: 1
                };
            }
        }


    }
}

module.exports = LoginService;
