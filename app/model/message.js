module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const MessageSchema = new Schema({
        fromUser: { type: ObjectId, ref: "User" },//来自用户
        user: { type: ObjectId, ref: "User" },//用户ID  
        type: { type: Number },//消息类型  0用户取消关注  1用户关注  2用户评论  3用户回答  4邀请回答
        question: { type: ObjectId, ref: 'Question' },
        isLook: { type: Boolean, default: false } , //是否查看
        createdTime:{type:Date,default:Date.now}
    })

    return Mongoose.model("Message", MessageSchema, "message");
}