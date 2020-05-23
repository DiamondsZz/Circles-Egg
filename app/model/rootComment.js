module.exports = app => {
    const Mongoose = app.mongoose;
    const Schema = Mongoose.Schema;
    const ObjectId = Mongoose.Schema.Types.ObjectId;
    const RootCommentSchema = new Schema({
        questionId: { type: ObjectId },//问题id
        answerId: { type: ObjectId },//回答id
        content: { type: String },  //评论内容
        like: { type: Number, default: Math.floor(Math.random() * 100) },   //评论点赞
        dislike: { type: Boolean, default: false },  //评论踩
        user: { type: ObjectId, default: "5df344b97b487d40c8b4e2c5", ref: 'User' },  //用户信息
        createdTime:{type:Date,default:Date.now}
    })

    return Mongoose.model("RootComment", RootCommentSchema, "rootComment");
}