'use strict';

const Service = require('egg').Service;
const moment = require("moment");
class MessageService extends Service {
    //生成消息
    async messageCreate(message) {
        let findRes = await this.ctx.model.Message.find({ type: message.type, fromUser: message.fromUser, user: message.user, question: message.question })
        let findResIsLook; //消息是否被查看
        if (findRes.length > 0) {
            findResIsLook = findRes.every((item) => {
                return item.isLook === true
            })
            if (findResIsLook) {
                let res = await this.ctx.model.Message.create(message);
                return res;
            } else {
                return "该消息还没有被查看"
            }
        } else {
            let res = await this.ctx.model.Message.create(message);
            return res;
        }

    }
    //未读消息获取
    async messageGet(id) {
        let res = await this.ctx.model.Message.find({ user: id, isLook: false }).populate("fromUser").populate("question").exec();
        return {
            messages: res.slice(0, 6),
            count: res.length
        };
    }
    //获取所有消息  按时间分类
    async messageAllGet(id) {
        let res = await this.ctx.model.Message.find({ user: id }).sort({'createdTime':-1}).populate("fromUser").populate("question").exec();
        let resType = new Set();  //消息类型
        let resMap = new Map();  //消息
        //获取消息时间分类
        for (let item of res) {
            resType.add(moment(item.createdTime).format("YYYY-MM-DD"))
        }
        for (let type of resType) {
            let resData = [];
            for (let message of res) {
                if (moment(message.createdTime).format("YYYY-MM-DD") === type)
                    resData.push(message)
            }
            resMap.set(type, resData);
        }

        return [...resMap]

    }
    //消息查看
    async messageLook(message) {
        let res = await Promise.all(message.map(async (item) => {
            let updateRes = await this.ctx.model.Message.update({ '_id': item }, { 'isLook': true })
            return updateRes
        }))
        return res;
    }
    //获取所有消息  按用户分类
    async messageAllUserGet(id) {
        const ObjectId = this.app.mongoose.Types.ObjectId;
        let res = await this.ctx.model.Message.find({ user: id }).populate("fromUser").exec();
        let resType = new Set();  //消息类型
        let resMap = new Map();  //消息
        let resUser = [];


        //获取消息用户分类
        for (let item of res) {
            //ObjectId类型  转换为字符串
            resType.add(item.fromUser._id.toHexString())
        }
        for (let type of resType) {
            let resCount = 0;
            for (let message of res) {
                if (message.fromUser._id.toHexString() === type)
                    resCount++;
            }
            let user = await this.ctx.model.User.findOne({ _id: type });
            resMap.set(user.userName, resCount);
        }


        //对消息数量的值进行从大到小排序  并取出前五个
        let resMapValuesSorted = [...resMap.values()].sort((a, b) => {
            return b - a;
        }).slice(0, 5)
        //获取回答对应的问题
        for (let key of resMapValuesSorted) {
            for (let entry of resMap.entries()) {
                if (entry[1] === key) {
                    if (resUser.length > 0) {
                        //判断已有问题中是否存在该问题
                        let isPushUser = resUser.find((item) => {
                            return item === entry[0];
                        })
                        if (isPushUser === undefined) {
                            resUser.push(entry[0])
                            break;
                        }
                    } else {
                        resUser.push(entry[0])
                        break;
                    }
                }
            }
        }

        return {
            user: resUser,
            count:resMapValuesSorted
        }
    }
}

module.exports = MessageService;
